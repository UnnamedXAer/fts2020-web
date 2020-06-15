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
import { AllInclusiveRounded as AllInclusiveRoundedIcon } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import CancelPresentationRoundedIcon from '@material-ui/icons/CancelPresentationRounded';
import QueuePlayNextRoundedIcon from '@material-ui/icons/QueuePlayNextRounded';
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import MembersList from '../../components/Flat/MembersList';
import RootState from '../../store/storeTypes';
import {
	StateError,
	TaskSpeedActions,
} from '../../ReactTypes/customReactTypes';
import {
	fetchTaskMembers,
	fetchTask,
	fetchTaskOwner,
	updateTask,
	fetchUserTasks,
} from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import TaskInfoTable from '../../components/Task/TaskInfoTable';
import TaskSchedule from '../../components/Task/TaskSchedule';
import { fetchTaskPeriods, completePeriod } from '../../store/actions/periods';
import CustomSpeedDial, {
	SpeedDialAction,
} from '../../components/UI/CustomSpeedDial';
import Task from '../../models/task';
import AlertDialog, { AlertDialogData } from '../../components/UI/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const actions: SpeedDialAction<TaskSpeedActions>[] = [
	{
		key: TaskSpeedActions.UpdateMembers,
		name: 'Update Members',
		icon: <GroupAddRoundedIcon />,
	},
	{
		key: TaskSpeedActions.CloseTask,
		name: 'Close Task',
		icon: <CancelPresentationRoundedIcon />,
	},
	{
		key: TaskSpeedActions.ResetPeriods,
		name: 'Reset Future Periods',
		icon: <QueuePlayNextRoundedIcon />,
	},
];

const elementsInitState = {
	loading: {
		owner: false,
		members: false,
		schedule: false,
	},
	error: {
		owner: null,
		members: null,
		schedule: null,
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
	if (action.type === 'loading' || action.type === 'not-loading')
		return { ...state, [action.name]: action.type === 'loading' };
	else {
		return {
			...state,
			error: { ...state.error, [action.name]: action.payload },
		};
	}
};

const TaskDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [error, setError] = useState<StateError>(null);
	const [userTasksError, setUserTasksError] = useState<StateError>(null);
	const id = +(props.match.params as RouterParams).id;
	const loggedUser = useSelector((state: RootState) => state.auth.user);
	const userTasksLoadTime = useSelector(
		(state: RootState) => state.tasks.userTasksLoadTime
	);
	const flatName = useSelector<RootState, string>((state) => {
		let flatName: string;
		const flat = state.flats.flats.find((x) => x.id === id);
		if (flat) {
			flatName = flat.name;
		} else {
			const userTask = state.tasks.userTasks.find((x) => x.id === id);
			flatName = userTask?.flatName!;
		}
		return flatName;
	});
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === id)
	);
	const periods = useSelector((state: RootState) =>
		task ? state.periods.taskPeriods[task.id!] : void 0
	);
	const [elements, elementsDispatch] = useReducer(
		elementsReducer,
		elementsInitState
	);
	const [periodsLoading, setPeriodsLoading] = useState<{
		[id: number]: boolean;
	}>({});
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
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (userTasksLoadTime === 0) {
			const loadUserTasks = async () => {
				setUserTasksError(null);
				try {
					await dispatch(fetchUserTasks());
				} catch (err) {
					if (isMounted.current) {
						if (isMounted.current) {
							const error = new HttpErrorParser(err);
							const msg = error.getMessage();
							setUserTasksError(msg);
						}
					}
				}
			};

			loadUserTasks();
		}
	}, [dispatch, userTasksLoadTime]);

	useEffect(() => {
		if (!task) {
			const loadTask = async (id: number) => {
				setError(null);
				try {
					await dispatch(fetchTask(id));
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
			};
			loadTask(id);
		}
	}, [dispatch, id, task]);

	useEffect(() => {
		if (
			task &&
			!periods &&
			!elements.loading.schedule &&
			!elements.error.schedule
		) {
			const loadSchedule = async (id: number) => {
				elementsDispatch({ name: 'schedule', type: 'loading' });

				try {
					await dispatch(fetchTaskPeriods(id));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'schedule',
							type: 'error',
							payload: msg,
						});
					}
				}
				isMounted.current &&
					elementsDispatch({ name: 'schedule', type: 'not-loading' });
			};
			loadSchedule(task.id!);
		}
	}, [
		dispatch,
		elements.error.schedule,
		elements.loading.schedule,
		periods,
		task,
	]);

	useEffect(() => {
		if (
			task &&
			!task.owner &&
			!elements.loading.owner &&
			!elements.error.owner
		) {
			const loadOwner = async () => {
				elementsDispatch({ name: 'owner', type: 'loading' });
				try {
					await dispatch(fetchTaskOwner(task.createBy!, task.id!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'owner',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current) {
					elementsDispatch({ name: 'owner', type: 'not-loading' });
				}
			};

			loadOwner();
		}

		if (
			task &&
			!task.members &&
			!elements.loading.members &&
			!elements.error.members
		) {
			const loadMembers = async () => {
				elementsDispatch({ name: 'members', type: 'loading' });

				try {
					await dispatch(fetchTaskMembers(task.id!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'members',
							type: 'error',
							payload: msg,
						});
					}
				}
				isMounted.current &&
					elementsDispatch({ name: 'members', type: 'not-loading' });
			};

			loadMembers();
		}
	}, [
		task,
		dispatch,
		elements.loading.members,
		elements.loading.owner,
		elements.error.owner,
		elements.error.members,
	]);

	const memberSelectHandler = (id: number) => {
		props.history.push(`/profile/${id}`);
	};

	const completePeriodHandler = async (id: number) => {
		setPeriodsLoading((prevState) => ({ ...prevState, [id]: true }));
		try {
			await dispatch(completePeriod(id, task!.id!));
			isMounted.current &&
				setSnackbarData({
					open: true,
					action: true,
					severity: 'success',
					timeout: 3000,
					content: 'Period completed.',
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
					title: 'Could not complete the period.',
				});
			}
		}
		isMounted.current &&
			setPeriodsLoading((prevState) => ({ ...prevState, [id]: false }));
	};

	const closeSnackbarAlertHandler = () => {
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const taskCloseHandler = async () => {
		const _task: Partial<Task> = new Task({
			id: task!.id,
			active: false,
		});
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(updateTask(_task));
			isMounted.current &&
				setSnackbarData({
					open: true,
					action: true,
					severity: 'success',
					timeout: 3000,
					content: 'Task closed.',
					onClose: closeSnackbarAlertHandler,
				});
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					action: true,
					severity: 'error',
					timeout: 4000,
					content: msg,
					onClose: closeSnackbarAlertHandler,
					title: 'Could not close task.',
				});
			}
		}
		isMounted.current &&
			setDialogData((prevState) => ({ ...prevState, open: false }));
	};

	const closeDialogAlertHandler = () =>
		setDialogData((prevState) => ({
			...prevState,
			open: prevState.loading,
		}));

	const speedDialOptionClickHandler = async (
		optionName: TaskSpeedActions
	) => {
		switch (optionName) {
			case TaskSpeedActions.UpdateMembers:
				props.history.push(`${props.match.url}/update-members`);
				break;
			case TaskSpeedActions.CloseTask:
				setDialogData({
					open: true,
					content: 'Do you want to close this task?',
					title: 'Close Task',
					onClose: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onClick: taskCloseHandler,
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
			case TaskSpeedActions.ResetPeriods:
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
						View Task
					</Typography>
				</Grid>
				{(error || userTasksError) && (
					<Grid item>
						<CustomMuiAlert severity="error">
							{error}
							{userTasksError && error && <br />}
							{userTasksError}
						</CustomMuiAlert>
					</Grid>
				)}
				<Grid item>
					<Grid
						container
						direction="row"
						spacing={4}
						alignItems="center"
					>
						<Grid item>
							<Avatar
								className={classes.avatar}
								alt="Task Avatar"
								src=""
							>
								<AllInclusiveRoundedIcon
									color="primary"
									aria-label="task icon"
								/>
							</Avatar>
						</Grid>
						<Grid
							item
							container
							direction="column"
							style={{ flex: 1 }}
						>
							<Grid item>
								{task ? (
									<Typography variant="h5" component="h2">
										{!task.active && (
											<span style={{ color: '#888' }}>
												[Inactive]{' '}
											</span>
										)}
										{task.name}
									</Typography>
								) : (
									<Skeleton animation="wave" height={46} />
								)}
							</Grid>
							<Grid item>
								{task?.owner ? (
									<Typography
										variant="subtitle1"
										color="textSecondary"
									>
										Created by{' '}
										<Link
											component={RouterLink}
											to={`/profile/${task.createBy}`}
										>
											{task.owner!.emailAddress}
										</Link>
									</Typography>
								) : (
									<Skeleton animation="wave" />
								)}
							</Grid>
							<Grid item>
								{task ? (
									<Typography
										variant="subtitle1"
										color="textSecondary"
									>
										{moment(task.createAt).format('llll')}
									</Typography>
								) : (
									<Skeleton animation="wave" />
								)}
							</Grid>
							<Grid item>
								{flatName && task ? (
									<Typography
										variant="subtitle1"
										color="textSecondary"
									>
										Flat:{' '}
										<Link
											component={RouterLink}
											to={`/flats/${task!.flatId}`}
										>
											{flatName}
										</Link>
									</Typography>
								) : (
									<Skeleton animation="wave" />
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Informations
						</Typography>
					</Grid>
					<Grid item>
						<TaskInfoTable task={task} />
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Description
						</Typography>
						{task ? (
							<TextField
								className={classes.description}
								value={task.description}
								multiline
								rowsMax={4}
								fullWidth
								variant="outlined"
								inputProps={{ readOnly: true }}
							/>
						) : (
							<Skeleton animation="wave" />
						)}
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Members
						</Typography>
						<MembersList
							error={elements.error.members}
							onMemberSelect={memberSelectHandler}
							loading={elements.loading.members}
							members={task?.members}
						/>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Schedule
						</Typography>
						<TaskSchedule
							data={periods}
							disabled={!task?.active}
							loading={
								(elements.loading.schedule || !periods) &&
								!elements.error.schedule
							}
							periodsLoading={periodsLoading}
							error={elements.error.schedule}
							loggedUserEmailAddress={loggedUser!.emailAddress}
							onCompletePeriod={completePeriodHandler}
						/>
					</Grid>
				</Grid>
			</Grid>
			<AlertSnackbar data={snackbarData} />

			<CustomSpeedDial
				actions={actions}
				hidden={
					!task ||
					!task.owner ||
					!task.active ||
					!task.members ||
					!loggedUser ||
					loggedUser.id !== task.owner.id
				}
				open={speedDialOpen}
				onClose={() => setSpeedDialOpen(false)}
				onClick={() => setSpeedDialOpen((prevState) => !prevState)}
				onOptionClick={speedDialOptionClickHandler}
			/>
			<AlertDialog data={dialogData} />
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		description: {
			paddingTop: theme.spacing(1),
			paddingBottom: theme.spacing(1),
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2),
			boxSizing: 'border-box',
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
	})
);

export default TaskDetails;
