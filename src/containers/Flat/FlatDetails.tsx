import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
	Grid,
	Typography,
	Avatar,
	makeStyles,
	Theme,
	createStyles,
	TextField,
	Link,
} from '@material-ui/core';
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import MembersList from '../../components/Flat/MembersList';
import RootState from '../../store/storeTypes';
import FlatTasks from './FlatTasks';
import {
	fetchFlatOwner,
	fetchFlatMembers,
	updateFlat,
	fetchFlatInvitations,
	updateInvitation,
	fetchFlats,
} from '../../store/actions/flats';
import {
	StateError,
	FlatSpeedActions,
} from '../../ReactTypes/customReactTypes';
import CustomSpeedDial, {
	SpeedDialAction,
} from '../../components/UI/CustomSpeedDial';
import AlertDialog, { AlertDialogData } from '../../components/UI/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import CancelPresentationRoundedIcon from '@material-ui/icons/CancelPresentationRounded';
import QueuePlayNextRoundedIcon from '@material-ui/icons/QueuePlayNextRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import HttpErrorParser from '../../utils/parseError';
import { FlatData } from '../../models/flat';
import InvitationsTable from '../../components/Flat/InvitationsTable';
import { InvitationAction } from '../../models/invitation';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import SendMessageDialog from '../../components/SendMessageDialog/SendMessageDialog';
import User from '../../models/user';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const actions: {
	owner: SpeedDialAction<FlatSpeedActions>[];
	member: SpeedDialAction<FlatSpeedActions>[];
	disabled: SpeedDialAction<FlatSpeedActions>[];
} = {
	owner: [
		{
			key: FlatSpeedActions.InviteMember,
			name: 'Invite new member',
			icon: <PersonAddRoundedIcon />,
		},
		{
			key: FlatSpeedActions.CloseFlat,
			name: 'Close Flat',
			icon: <CancelPresentationRoundedIcon />,
		},
		{
			key: FlatSpeedActions.AddTask,
			name: 'Add Task',
			icon: <QueuePlayNextRoundedIcon />,
		},
	],
	member: [
		{
			key: FlatSpeedActions.LeaveFlat,
			name: 'Leave Flat',
			icon: <ExitToAppRoundedIcon />,
		},
		{
			key: FlatSpeedActions.AddTask,
			name: 'Add Task',
			icon: <QueuePlayNextRoundedIcon />,
		},
	],
	disabled: [
		{
			key: FlatSpeedActions.LeaveFlat,
			name: 'Leave Flat',
			icon: <ExitToAppRoundedIcon />,
		},
	],
};

const elementsInitState = {
	loading: {
		owner: false,
		members: false,
		invitations: false,
	},
	error: {
		owner: null,
		members: null,
		invitations: null,
	},
	loadTime: {
		owner: false,
		members: false,
		invitations: false,
	},
};

type ElementsState = typeof elementsInitState;
type ElementsName = keyof ElementsState['loading'];
type ElementsAction = {
	type: 'loading' | 'not-loading' | 'error' | 'not-error';
	name: ElementsName;
	payload?: StateError;
};

type ElementsReducer = (
	state: ElementsState,
	action: ElementsAction
) => ElementsState;

const elementsReducer: ElementsReducer = (state, action) => {
	if (action.type === 'loading' || action.type === 'not-loading') {
		return {
			...state,
			loading: {
				...state.loading,
				[action.name]: action.type === 'loading',
			},
			loadTime: {
				...state.loadTime,
				[action.name]: true,
			},
		};
	} else {
		return {
			...state,
			error: { ...state.error, [action.name]: action.payload },
		};
	}
};

const FlatDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [error, setError] = useState<StateError>(null);
	const id = +(props.match.params as RouterParams).id;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	);
	const flatsLoadTime = useSelector(
		(state: RootState) => state.flats.flatsLoadTime
	);

	const loggedUser = useSelector((state: RootState) => state.auth.user);

	const [elements, elementsDispatch] = useReducer(elementsReducer, {
		...elementsInitState,
		loadTime: {
			owner: !!flat?.owner,
			members: !!flat?.members,
			invitations: !!flat?.invitations,
		},
	} as ElementsState);

	const [messageUser, setMessageUser] = useState<User | null>(null);
	const [showMessageDialog, setShowMessageDialog] = useState(false);

	const [loadingInvs, setLoadingInvs] = useState<{ [key: number]: boolean }>(
		{}
	);

	const [snackbarData, setSnackbarData] = useState<AlertSnackbarData>({
		content: '',
		onClose: () => {},
		open: false,
	});
	const [speedDialOpen, setSpeedDialOpen] = useState(false);
	const [dialogData, setDialogData] = useState<AlertDialogData>({
		content: '',
		onClose: () => {},
		title: '',
		loading: false,
		open: false,
	});

	const isMounted = useRef<number | null>(id);
	useEffect(() => {
		isMounted.current = id;
		return () => {
			isMounted.current = null;
		};
	}, [id]);

	useEffect(() => {
		if (flatsLoadTime !== 0 && !flat) {
			setError(
				'Unauthorized access - You do not have permissions to view this flat.'
			);
		}
	}, [flat, flatsLoadTime]);

	useEffect(() => {
		if (flatsLoadTime === 0) {
			const loadFlats = async () => {
				try {
					await dispatch(fetchFlats());
				} catch (err) {
					if (isMounted.current !== null) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setError(msg);
					}
				}
			};

			loadFlats();
		}
	}, [dispatch, flatsLoadTime]);

	useEffect(() => {
		if (flat && !elements.loadTime.owner) {
			const loadOwner = async (userId: number, flatId: number) => {
				elementsDispatch({ name: 'owner', type: 'loading' });
				try {
					await dispatch(fetchFlatOwner(userId, flatId));
				} catch (err) {
					if (isMounted.current === flatId) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'owner',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current === flatId) {
					elementsDispatch({ name: 'owner', type: 'not-loading' });
				}
			};

			loadOwner(flat.ownerId, flat.id!);
		}
	}, [dispatch, elements.loadTime.owner, flat]);

	useEffect(() => {
		if (flat && !elements.loadTime.members) {
			const loadMembers = async () => {
				elementsDispatch({ name: 'members', type: 'loading' });

				try {
					await dispatch(fetchFlatMembers(flat.id!));
				} catch (err) {
					if (isMounted.current === flat.id) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'members',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current === flat.id) {
					elementsDispatch({ name: 'members', type: 'not-loading' });
				}
			};

			loadMembers();
		}
	}, [dispatch, elements.loadTime.members, flat]);

	useEffect(() => {
		if (flat && !elements.loadTime.invitations) {
			const loadInvitations = async () => {
				elementsDispatch({ name: 'invitations', type: 'loading' });
				try {
					await dispatch(fetchFlatInvitations(flat.id!));
				} catch (err) {
					if (isMounted.current === flat.id) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'invitations',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current === flat.id) {
					elementsDispatch({
						name: 'invitations',
						type: 'not-loading',
					});
				}
			};

			loadInvitations();
		}
	}, [dispatch, elements.loadTime.invitations, flat]);

	const memberSelectHandler = (id: number) => {
		props.history.push(`/profile/${id}`);
	};

	const closeFlatHandler = async () => {
		const _flat: Partial<FlatData> = new FlatData({
			id: flat!.id,
			active: false,
		});
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(updateFlat(_flat));
			if (isMounted.current !== null) {
				setSnackbarData({
					open: true,
					action: true,
					severity: 'success',
					timeout: 3000,
					content: 'Flat closed.',
					onClose: closeSnackbarAlertHandler,
				});
			}
		} catch (err) {
			if (isMounted.current !== null) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					action: true,
					severity: 'error',
					timeout: 4000,
					content: msg,
					onClose: closeSnackbarAlertHandler,
					title: 'Could not close flat.',
				});
			}
		} finally {
			isMounted.current !== null &&
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
		}
	};

	const closeDialogAlertHandler = () =>
		setDialogData((prevState) => ({
			...prevState,
			open: prevState.loading,
		}));

	const closeSnackbarAlertHandler = () =>
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));

	const speedDialOptionClickHandler = async (optionKey: FlatSpeedActions) => {
		switch (optionKey) {
			case FlatSpeedActions.InviteMember:
				props.history.push(`/flats/${flat!.id}/invite-members`);
				break;
			case FlatSpeedActions.CloseFlat:
				setDialogData({
					open: true,
					content: 'Do you want to close this flat?',
					title: 'Close Flat',
					onClose: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onClick: closeFlatHandler,
							color: 'primary',
						},
						{
							color: 'secondary',
							label: 'Cancel',
							onClick: closeDialogAlertHandler,
						},
					],
				});

				break;
			case FlatSpeedActions.AddTask:
				props.history.push(`/flats/${flat!.id}/tasks/add`);
				break;
			default:
				break;
		}
		setSpeedDialOpen(false);
	};

	const invitationActionHandler = async (
		id: number,
		action: InvitationAction
	) => {
		setLoadingInvs((prevState) => ({ ...prevState, [id]: true }));
		try {
			await dispatch(updateInvitation(id, flat!.id!, action));
			isMounted.current &&
				setSnackbarData({
					open: true,
					action: true,
					severity: 'info',
					timeout: 3000,
					content: 'Invitation action executed.',
					onClose: closeSnackbarAlertHandler,
				});
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setSnackbarData({
					open: true,
					action: true,
					severity: 'error',
					timeout: 4000,
					content: msg,
					onClose: closeSnackbarAlertHandler,
					title: 'Could not complete the action.',
				});
			}
		}
		isMounted.current &&
			setLoadingInvs((prevState) => ({ ...prevState, [id]: false }));
	};

	const deleteMember = async (id: number) => {
		console.log('removing', id);
	};

	const deleteMemberHandler = (id: number) => {
		const user = flat!.members!.find((x) => x.id === id);

		setDialogData({
			open: true,
			content: `Do you want to remove ${user!.emailAddress} (${
				user!.userName
			}) from your flat?`,
			title: 'Remove member',
			onClose: closeDialogAlertHandler,
			loading: false,
			actions: [
				{
					label: 'Yes',
					onClick: () => deleteMember(id),
					color: 'primary',
				},
				{
					color: 'secondary',
					label: 'Cancel',
					onClick: closeDialogAlertHandler,
				},
			],
		});
	};

	const sendMessageToMemberHandler = (id: number) => {
		setMessageUser(flat!.members!.find((x) => x.id === id)!);
		setShowMessageDialog(true);
	};

	const sendMessageCallback = (success: boolean) => {
		if (success) {
			setSnackbarData({
				open: true,
				action: true,
				severity: 'success',
				timeout: 3000,
				content: 'Message sent.',
				onClose: closeSnackbarAlertHandler,
				title: 'Message sent.',
			});
			setShowMessageDialog(false);
		} else {
			setSnackbarData({
				open: true,
				action: true,
				severity: 'error',
				timeout: 4000,
				content:
					'Sorry, could not send the message, please try again later',
				onClose: closeSnackbarAlertHandler,
				title: 'Could not send the message',
			});
		}
	};

	let fabActions: SpeedDialAction<FlatSpeedActions>[];
	if (loggedUser && flat) {
		if (flat.active) {
			fabActions =
				actions[loggedUser.id === flat.ownerId ? 'owner' : 'member'];
		} else {
			fabActions = actions.disabled;
		}
	} else {
		fabActions = [];
	}

	return (
		<>
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						View Flat
					</Typography>
				</Grid>
				{error && (
					<Grid item>
						<CustomMuiAlert severity="error">
							{error}
						</CustomMuiAlert>
					</Grid>
				)}
				<Grid item>
					<Grid
						container
						item
						direction="row"
						spacing={4}
						alignItems="center"
					>
						<Grid item>
							<Avatar
								className={classes.avatar}
								alt="flat avatar"
								src="https://vscode-icons-team.gallerycdn.vsassets.io/extensions/vscode-icons-team/vscode-icons/10.0.0/1581882255844/Microsoft.VisualStudio.Services.Icons.Default"
							>
								<HomeIcon color="primary" />
							</Avatar>
						</Grid>
						<Grid item>
							{flat ? (
								<Typography variant="h5" component="h2">
									{!flat.active && (
										<span style={{ color: '#888' }}>
											[Inactive]{' '}
										</span>
									)}
									{flat.name}
								</Typography>
							) : (
								<Skeleton height={48} animation="wave" />
							)}
							{flat?.owner ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									Created by{' '}
									<Link
										component={RouterLink}
										to={`/profile/${flat.ownerId}`}
									>
										{flat.owner.emailAddress} (
										{flat.owner.userName})
									</Link>
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
							{flat ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									{moment(flat.createAt).format('llll')}
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
						</Grid>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Description
						</Typography>
						<TextField
							className={classes.description}
							value={flat ? flat.description : ''}
							placeholder="no description"
							multiline
							rowsMax={4}
							fullWidth
							variant="outlined"
							inputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Members
						</Typography>
						<MembersList
							error={elements.error.members}
							onMemberSelect={memberSelectHandler}
							loading={elements.loading.members}
							members={flat?.members}
							onMemberDelete={
								flat?.ownerId === loggedUser?.id
									? deleteMemberHandler
									: void 0
							}
							onMemberMessage={sendMessageToMemberHandler}
						/>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Invited People
						</Typography>
						<InvitationsTable
							error={elements.error.invitations}
							loading={elements.loading.invitations}
							invitations={flat?.invitations}
							flatOwner={loggedUser!.id === flat?.ownerId}
							loadingInvs={loadingInvs}
							onInvitationAction={invitationActionHandler}
							disabled={!flat || !flat.active}
						/>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Tasks
						</Typography>
						<FlatTasks flatId={flat?.id!} />
					</Grid>
				</Grid>
			</Grid>
			<AlertSnackbar data={snackbarData} />
			<CustomSpeedDial
				actions={fabActions}
				hidden={
					!flat ||
					!loggedUser ||
					(!flat.active && loggedUser.id === flat.ownerId) ||
					!flat.owner ||
					!flat.members ||
					!flat.invitations
				}
				open={speedDialOpen}
				onClose={() => setSpeedDialOpen(false)}
				onClick={() => setSpeedDialOpen((prevState) => !prevState)}
				onOptionClick={speedDialOptionClickHandler}
			/>
			<AlertDialog data={dialogData} />
			<SendMessageDialog
				user={messageUser}
				open={showMessageDialog}
				onMessageSent={sendMessageCallback}
				onClose={() => {
					setShowMessageDialog(false);
				}}
			/>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		description: {
			paddingTop: 10,
			paddingBottom: 10,
			boxSizing: 'border-box',
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
		margin: {
			margin: theme.spacing(1),
		},
		gridItem: {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(1),
		},
		fab: {
			position: 'fixed',
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
);

export default FlatDetails;
