import React, { useEffect, useState } from 'react';
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
import {
	HomeWorkOutlined as HomeIcon,
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import FlatMembers from '../../components/Flat/FlatMembers';
import RootState from '../../store/storeTypes';
import { StateError } from '../../ReactTypes/customReactTypes';
import { fetchTaskMembers } from '../../store/actions/tasks';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const TaskDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const id = +(props.match.params as RouterParams).id;
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === id)
	)!;

	const [loadingElements, setLoadingElements] = useState({
		members: !!task.members,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
	}>({
		owner: null,
		members: null,
	});

	useEffect(() => {
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
	}

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
							<Typography
								variant="h5"
								component="h2"
								className={classes.title}
							>
								{task.name}
							</Typography>
							{task.owner ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									Created By {task.owner!.emailAddress}
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
							<Typography
								variant="subtitle1"
								color="textSecondary"
							>
								{moment(task.createAt).format('llll')}
							</Typography>
						</Grid>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Description
						</Typography>
						<TextField
							className={classes.description}
							value={task.description}
							multiline
							rowsMax={4}
							fullWidth
							variant="outlined"
							inputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Members
						</Typography>
						<FlatMembers
							onMemberSelect={memberSelectHandler}
							loading={!task.members}
							members={task.members}
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
