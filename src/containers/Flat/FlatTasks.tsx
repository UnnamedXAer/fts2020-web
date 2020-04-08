import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlatTasks, fetchTaskMembers } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import {
	CircularProgress,
	Modal,
	Backdrop,
	Fade,
	makeStyles,
	createStyles,
	Theme,
	Container,
} from '@material-ui/core';
import ErrorCart from '../../components/UI/ErrorCart';
import RootState from '../../store/storeTypes';
import Task from '../../models/task';
import FlatTasksTable from '../../components/Flat/FlatTasksTable';
import TaskInfoModalContent from '../../components/Flat/TaskInfoModalContent';

interface Props {
	flatId: number;
}

const FlatTasks: React.FC<Props> = ({ flatId }) => {
	const classes = useStyles();

	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const tasks = useSelector<RootState, Task[]>(
		(state) => state.tasks.flatsTasks[flatId]
	);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [membersLoading, setMembersLoading] = useState<{
		[taskId: number]: boolean;
	}>({});
	const [membersError, setMembersError] = useState<{
		[taskId: number]: string | null;
	}>({});

	useEffect(() => {
		if (!tasks) {
			setLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchFlatTasks(flatId));
				} catch (err) {
					const message = new HttpErrorParser(err).getMessage();
					setError(message);
				}
				setLoading(false);
			};

			loadTasks();
		} else {
			setLoading(false);
		}
	}, [dispatch, flatId, tasks]);

	useEffect(() => {
		if (
			selectedTaskId &&
			!membersLoading[selectedTaskId] &&
			!membersError[selectedTaskId]
		) {
			const task = tasks.find((x) => x.id === selectedTaskId)!;
			if (!task.members) {
				const loadMembers = async (taskId: number) => {
					setMembersError((prevState) => ({
						...prevState,
						[taskId]: null,
					}));
					setMembersLoading((prevState) => ({
						...prevState,
						[taskId]: true,
					}));
					try {
						await dispatch(fetchTaskMembers(flatId, taskId));
					} catch (err) {
						setMembersError((prevState) => ({
							...prevState,
							[taskId]: err.message,
						}));
					}
					setMembersLoading((prevState) => ({
						...prevState,
						[taskId]: false,
					}));
				};

				loadMembers(selectedTaskId);
			}
		}
	}, [dispatch, flatId, membersError, membersLoading, selectedTaskId, tasks]);

	const taskSelectHandler = (id: number) => {
		setSelectedTaskId(id);
	};

	if (error) {
		return <ErrorCart message={error} showHeader />;
	} else if (loading) {
		return <CircularProgress color="primary" />;
	}
	return (
		<>
			<FlatTasksTable tasks={tasks} onTaskSelected={taskSelectHandler} />
			<Modal
				aria-labelledby="modal-task-title-id"
				aria-describedby="modal-task-description-id"
				className={classes.modal}
				open={selectedTaskId !== null}
				onClose={() => setSelectedTaskId(null)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={selectedTaskId !== null} unmountOnExit mountOnEnter>
					<Container className={classes.modalContent} maxWidth="sm">
						{selectedTaskId && (
							<TaskInfoModalContent
								task={
									tasks.find((x) => x.id === selectedTaskId)!
								}
								membersError={membersError[selectedTaskId]}
								membersLoading={membersLoading[selectedTaskId]}
							/>
						)}
					</Container>
				</Fade>
			</Modal>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		modalContent: {
			backgroundColor: theme.palette.background.paper,
			border: '2px solid #000',
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	})
);

export default FlatTasks;
