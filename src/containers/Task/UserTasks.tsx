import React, { useState, useEffect, useRef } from 'react';
import {
	Grid,
	List,
	ListItem,
	Typography,
	ListItemAvatar,
	Avatar,
	ListItemText,
	makeStyles,
	Theme,
	CircularProgress,
	Box,
	Link,
	FormControlLabel,
	Checkbox,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AllInclusiveRounded as AllInclusiveRoundedIcon } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { UserTask } from '../../models/task';
import RootState from '../../store/storeTypes';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { fetchUserTasks } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import { StateError } from '../../ReactTypes/customReactTypes';

interface Props extends RouteComponentProps {}

const UserTasks: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [showInactive, setShowInactive] = useState(localStorage.getItem('user_tasks_show_inactive') === '1');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const tasks = useSelector<RootState, UserTask[]>((state) =>
		showInactive
			? state.tasks.userTasks
			: state.tasks.userTasks.filter((x) => x.active)
	);
	const userTasksLoadTime = useSelector<RootState, number>(
		(state) => state.tasks.userTasksLoadTime
	);
	const [selectedTask, setSelectedTask] = useState<number | null>(null);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (userTasksLoadTime < Date.now() - 1000 * 60 * 60 * 8) {
			setLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchUserTasks());
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
				isMounted.current && setLoading(false);
			};
			loadTasks();
		}
	}, [dispatch, userTasksLoadTime]);

	const taskClickHandler = (taskId: number) => {
		setSelectedTask(taskId);
	};

	const showInactiveChangeHandler = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		localStorage.setItem('user_tasks_show_inactive', checked ? '1' : '0');
		setShowInactive(checked);
	};

	let content = (
		<Box textAlign="center">
			<CircularProgress size={36} color="primary" />
		</Box>
	);

	if (error) {
		content = (
			<CustomMuiAlert severity="error">
				Could not load tasks due to following reason: <br />
				{error}
			</CustomMuiAlert>
		);
	} else if (!loading) {
		if (tasks.length === 0) {
			content = (
				<CustomMuiAlert severity="info">
					<span>
						You are not a member of any task. You can go to{' '}
						<Link
							className={classes.alertLink}
							color="inherit"
							title="Go to My Flats"
							component={RouterLink}
							to="/flats"
						>
							Your Flats
						</Link>{' '}
						section and create task for a flat.
					</span>
				</CustomMuiAlert>
			);
		} else {
			content = (
				<List dense={false} style={{ paddingTop: 0 }}>
					{tasks.map((task) => {
						const name = (
							<>
								{!task.active && (
									<span style={{ color: '#888' }}>
										[Inactive]{' '}
									</span>
								)}
								{task.name}
							</>
						);
						return (
							<ListItem
								key={task.id}
								button
								onClick={() => taskClickHandler(task.id!)}
							>
								<ListItemAvatar>
									<Avatar>
										<AllInclusiveRoundedIcon color="primary" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={name}
									secondary={
										<>
											<Typography component="span">
												Flat:{' '}
												<Link
													component={RouterLink}
													to={`/flats/${task.flatId}`}
													color="primary"
													variant="body1"
												>
													{task.flatName}
												</Link>
											</Typography>{' '}
											<br />
											<Typography component="span">
												Period:{' '}
												<Typography
													component="span"
													color="textPrimary"
												>
													{task.timePeriodValue}{' '}
													{task.timePeriodUnit?.toLocaleLowerCase()}
													{task.timePeriodValue! >
														1 && 's'}
												</Typography>
											</Typography>
										</>
									}
								/>
							</ListItem>
						);
					})}
				</List>
			);
		}
	}
	return (
		<>
			{selectedTask && <Redirect push to={`/tasks/${selectedTask}`} />}
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						Your Tasks
					</Typography>
					<FormControlLabel
						control={
							<Checkbox
								checked={showInactive}
								onChange={showInactiveChangeHandler}
								name="showInactive"
								color="primary"
							/>
						}
						label="Show inactive"
					/>
				</Grid>
				<Grid item style={{ paddingTop: 0 }}>
					{content}
				</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	alertLink: {
		position: 'relative',
		color: theme.palette.warning.light,

		'&:hover': {
			zIndex: 1,
			textDecoration: 'none',
			'&::before': {
				position: 'absolute',
				bottom: 0,
				left: 0,
				content: '""',
				color: 'red',
				backgroundColor: theme.palette.info.dark,
				opacity: 0.5,
				width: '100%',
				transform: 'scaleX(0)',
				height: 3,
				animation: `$myEffect 1100ms ${theme.transitions.easing.easeInOut}`,
				animationFillMode: 'forwards',
				zIndex: -1,
			},
		},
	},
	'@keyframes myEffect': {
		'0%': {
			transform: 'scaleX(0)',
			height: 3,
		},
		'40%': {
			transform: 'scaleX(1.2)',
			height: 3,
		},
		'100%': {
			height: '1.3em',
			transform: 'scaleX(1.2)',
		},
	},
}));

export default UserTasks;
