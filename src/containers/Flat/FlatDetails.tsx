import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
	Grid,
	Typography,
	Avatar,
	makeStyles,
	Theme,
	createStyles,
	TextField,
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
import HttpErrorParser from '../../utils/parseError';
import { FlatData } from '../../models/flat';
import InvitationsTable from '../../components/Flat/InvitationsTable';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const actions: SpeedDialAction<FlatSpeedActions>[] = [
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
];

const FlatDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const id = +(props.match.params as RouterParams).id;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	)!;
	const loggedUser = useSelector((state: RootState) => state.auth.user);

	const [loadingElements, setLoadingElements] = useState({
		owner: false,
		members: false,
		invitations: false,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
		invitations: StateError;
	}>({
		owner: null,
		members: null,
		invitations: null,
	});
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

	const loadOwner = useCallback(
		async (userId, flatId) => {
			setLoadingElements((prevState) => ({
				...prevState,
				owner: true,
			}));
			try {
				await dispatch(fetchFlatOwner(userId, flatId));
			} catch (err) {
				if (isMounted.current === flatId) {
					setElementsErrors((prevState) => ({
						...prevState,
						owner: err.message,
					}));
				}
			}
			if (isMounted.current === flatId) {
				setLoadingElements((prevState) => ({
					...prevState,
					owner: false,
				}));
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (!flat.owner && !loadingElements.owner && !elementsErrors.owner) {
			loadOwner(flat.ownerId, flat.id);
		}
	}, [
		elementsErrors.owner,
		flat.id,
		flat.owner,
		flat.ownerId,
		loadOwner,
		loadingElements.owner,
	]);

	const loadMembers = useCallback(
		async (flatId) => {
			setLoadingElements((prevState) => ({
				...prevState,
				members: true,
			}));
			try {
				await dispatch(fetchFlatMembers(flatId));
			} catch (err) {
				if (isMounted.current === flatId) {
					setElementsErrors((prevState) => ({
						...prevState,
						members: err.message,
					}));
				}
			}
			if (isMounted.current === flatId) {
				setLoadingElements((prevState) => ({
					...prevState,
					members: false,
				}));
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (
			!flat.members &&
			!loadingElements.members &&
			!elementsErrors.members
		) {
			loadMembers(id);
		}
	}, [
		elementsErrors.members,
		flat.members,
		id,
		loadMembers,
		loadingElements.members,
	]);

	const loadInvitations = useCallback(
		async (flatId) => {
			setLoadingElements((prevState) => ({
				...prevState,
				invitations: true,
			}));
			try {
				await dispatch(fetchFlatInvitations(flatId));
			} catch (err) {
				if (isMounted.current === flatId) {
					setElementsErrors((prevState) => ({
						...prevState,
						invitations: err.message,
					}));
				}
			}
			if (isMounted.current === flatId) {
				setLoadingElements((prevState) => ({
					...prevState,
					invitations: false,
				}));
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (
			!flat.invitations &&
			!loadingElements.invitations &&
			!elementsErrors.invitations
		) {
			loadInvitations(id);
		}
	}, [
		elementsErrors.invitations,
		flat.invitations,
		id,
		loadInvitations,
		loadingElements.invitations,
	]);

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
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
			}
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

	const speedDialOptionClickHandler = async (
		optionName: FlatSpeedActions
	) => {
		switch (optionName) {
			case FlatSpeedActions.InviteMember:
				props.history.push(`/flats/${flat.id}/invite-members`);
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
				props.history.push(`/flats/${flat.id}/tasks/add`);
				break;
			default:
				break;
		}
		setSpeedDialOpen(false);
	};

	return (
		<>
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						View Flat
					</Typography>
				</Grid>
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
							<Typography variant="h5" component="h2">
								{flat.name}
							</Typography>
							{flat.owner ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									Created By {flat.owner!.emailAddress}
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
							<Typography
								variant="subtitle1"
								color="textSecondary"
							>
								{moment(flat.createAt).format('llll')}
							</Typography>
						</Grid>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Description
						</Typography>
						<TextField
							className={classes.description}
							value={flat.description}
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
							error={elementsErrors.members}
							onMemberSelect={memberSelectHandler}
							loading={loadingElements.members}
							members={flat.members}
						/>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Invited People
						</Typography>
						<InvitationsTable
							error={elementsErrors.invitations}
							loading={loadingElements.invitations}
							invitations={flat.invitations}
							flatOwner={loggedUser!.id === flat.ownerId}
							flatId={id}
						/>
					</Grid>
					<Grid item className={classes.gridItem}>
						<Typography variant="h5" component="h3">
							Tasks
						</Typography>
						<FlatTasks flatId={flat.id as number} />
					</Grid>
				</Grid>
			</Grid>
			<AlertSnackbar data={snackbarData} />
			<CustomSpeedDial
				actions={actions}
				disabled={
					!flat ||
					!loggedUser ||
					!flat.owner ||
					loggedUser.id !== flat.owner.id
				}
				open={speedDialOpen}
				toggleOpen={() => setSpeedDialOpen((prevState) => !prevState)}
				onOptionClick={speedDialOptionClickHandler}
			/>
			<AlertDialog data={dialogData} />
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
