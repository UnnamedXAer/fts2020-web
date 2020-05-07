import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AllInclusiveRounded as AllInclusiveRoundedIcon } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { UserTask } from '../../models/task';
import RootState from '../../store/storeTypes';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { fetchUserTasks } from '../../store/actions/tasks';

interface Props extends RouteComponentProps {}

const UserTasks: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const tasks = useSelector<RootState, UserTask[]>(
		(state) => state.tasks.userTasks
	);
	const userTasksLoadTime = useSelector<RootState, number>(
		(state) => state.tasks.userTasksLoadTime
	);

	const [selectedTask, setSelectedTask] = useState<number | null>(null);

	useEffect(() => {
		if (userTasksLoadTime < Date.now() - 1000 * 60 * 60 * 8) {
			setLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchUserTasks());
				} catch (err) {
					setError(err.message);
				}
				setLoading(false);
			};
			loadTasks();
		}
	}, [dispatch, userTasksLoadTime]);

	const taskClickHandler = (taskId: number) => {
		setSelectedTask(taskId);
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
					<span>You are not a member of any task.</span>
				</CustomMuiAlert>
			);
		} else {
			content = (
				<List dense={false}>
					{tasks.map((task) => (
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
								primary={task.name}
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
												{task.timePeriodValue! > 1 &&
													's'}
											</Typography>
										</Typography>
									</>
								}
							/>
						</ListItem>
					))}
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
				</Grid>
				<Grid item>{content}</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		margin: theme.spacing(4, 0, 2),
	},
	fab: {
		position: 'fixed',
		bottom: 20,
		right: 20,
	},
	margin: {
		margin: theme.spacing(1),
	},
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
