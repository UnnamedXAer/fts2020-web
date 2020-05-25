import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlatTasks, fetchTaskMembers } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import ErrorCart from '../../components/UI/ErrorCart';
import RootState from '../../store/storeTypes';
import Task from '../../models/task';
import FlatTasksTable from '../../components/Flat/FlatTasksTable';
import TaskInfoModalContent from '../../components/Flat/TaskInfoModalContent';
import CustomModal from '../../components/UI/CustomModal';

interface Props {
	flatId: number;
}

const FlatTasks: React.FC<Props> = ({ flatId }) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tasksFetchTime, setTasksFetchTime] = useState(0);
	const tasks = useSelector<RootState, Task[]>((state) =>
		state.tasks.tasks.filter((x) => x.flatId === flatId)
	);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [membersLoading, setMembersLoading] = useState<{
		[taskId: number]: boolean;
	}>({});
	const [membersError, setMembersError] = useState<{
		[taskId: number]: string | null;
	}>({});

	useEffect(() => {
		if (
			!loading &&
			!error &&
			tasks.length === 0 &&
			tasksFetchTime < Date.now() - 1000 * 60 * 60 * 1
		) {
			setLoading(true);
			setError(null);
			setTasksFetchTime(Date.now());
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
	}, [dispatch, error, flatId, loading, tasks, tasksFetchTime]);

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
						await dispatch(fetchTaskMembers(taskId));
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
		setShowTaskModal(true);
	};

	const memberSelectHandler = (id: number) => {
		history.push(`/profile/${id}`);
	};

	if (error) {
		return <ErrorCart message={error} showHeader />;
	} else if (loading) {
		return <CircularProgress color="primary" />;
	}
	return (
		<>
			<FlatTasksTable tasks={tasks} onTaskSelected={taskSelectHandler} />
			<CustomModal
				onClose={() => {
					setShowTaskModal(false);
				}}
				onCloseIconClick={() => {
					setShowTaskModal(false);
				}}
				open={showTaskModal}
			>
				{selectedTaskId && (
					<TaskInfoModalContent
						task={tasks.find((x) => x.id === selectedTaskId)!}
						membersError={membersError[selectedTaskId]}
						membersLoading={membersLoading[selectedTaskId]}
						onMemberSelect={memberSelectHandler}
					/>
				)}
			</CustomModal>
		</>
	);
};

export default FlatTasks;
