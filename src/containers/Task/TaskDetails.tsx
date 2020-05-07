import React, { useEffect, useState } from 'react';
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
import FlatMembers from '../../components/Flat/FlatMembers';
import RootState from '../../store/storeTypes';
import { StateError } from '../../ReactTypes/customReactTypes';
import {
	fetchTaskMembers,
	fetchTask,
	fetchTaskOwner,
} from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const TaskDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [error, setError] = useState<StateError>(null);

	const id = +(props.match.params as RouterParams).id;
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === id)
	);

	const [loadingElements, setLoadingElements] = useState({
		members: !(!task || !task.members),
		owner: !(!task || !task.owner),
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
	}>({
		owner: null,
		members: null,
	});

	useEffect(() => {
		if (!task) {
			const loadTask = async (id: number) => {
				setError(null);
				try {
					await dispatch(fetchTask(id));
				} catch (err) {
					const error = new HttpErrorParser(err);
					const msg = error.getMessage();
					setError(msg);
				}
			};
			loadTask(id);
		}
	}, [dispatch, id, task]);

	console.log(task?.members);

	useEffect(() => {
		if (
			task &&
			!task.owner &&
			!loadingElements.owner &&
			!elementsErrors.owner
		) {
			const loadOwner = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					owner: true,
				}));
				try {
					await dispatch(fetchTaskOwner(task.createBy!, task.id!));
				} catch (err) {
					setElementsErrors((prevState) => ({
						...prevState,
						owner: err.message,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					owner: false,
				}));
			};

			loadOwner();
		}

		if (
			task &&
			!task.members &&
			!loadingElements.members &&
			!elementsErrors.members
		) {
			const loadMembers = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					members: true,
				}));
				try {
					await dispatch(fetchTaskMembers(task.id!));
				} catch (err) {
					setElementsErrors((prevState) => ({
						...prevState,
						members: err.message,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					members: false,
				}));
			};

			loadMembers();
		}
	}, [task, dispatch, loadingElements, elementsErrors]);

	const memberSelectHandler = (id: number) => {
		props.history.push(`/profile/${id}`);
	};

	return (
		<>
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						View Task
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
								src=""
							>
								<AllInclusiveRoundedIcon
									color="primary"
									aria-label="task icon"
								/>
							</Avatar>
						</Grid>
						<Grid item>
							{task ? (
								<Typography
									variant="h5"
									component="h2"
									className={classes.title}
								>
									{task.name}
								</Typography>
							) : (
								<Skeleton animation="wave" height={46} />
							)}
							{task?.owner ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									Created by <Link component={RouterLink} to={`/profile/${task.createBy}`}>{task.owner!.emailAddress}</Link>
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
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
						<FlatMembers
							onMemberSelect={memberSelectHandler}
							loading={loadingElements.members}
							members={task?.members}
						/>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {},
		description: {
			paddingTop: 10,
			paddingBottom: 10,
			paddingLeft: 16,
			paddingRight: 16,
			boxSizing: 'border-box',
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
		margin: {
			margin: theme.spacing(1),
		},
		fab: {
			position: 'fixed',
			bottom: 20,
			right: 20,
		},
	})
);

export default TaskDetails;
