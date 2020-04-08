import { AppReducer, TasksState, SimpleReducer } from '../storeTypes';
import { TasksActionTypes } from '../actions/actionTypes';
import Task from '../../models/task';
import User from '../../models/user';

const initialState: TasksState = {
	flatsTasks: {},
};

const setTasks: SimpleReducer<TasksState, { flatId: number; tasks: Task[] }> = (
	state,
	action
) => {
	const updatedFlatsTasks = {
		...state.flatsTasks,
		[action.payload.flatId]: action.payload.tasks,
	};

	return {
		...state,
		flatsTasks: updatedFlatsTasks,
	};
};

const addTask: SimpleReducer<TasksState, Task> = (state, action) => {
	const updatedFlatsTasks = {
		...state.flatsTasks,
		[action.payload.flatId!]: state.flatsTasks[
			action.payload.flatId!
		].concat(action.payload),
	};

	return {
		...state,
		flatsTasks: updatedFlatsTasks,
	};
};

const setMembers: SimpleReducer<
	TasksState,
	{ flatId: number; taskId: number; members: User[] }
> = (state, action) => {
	const { flatId, taskId, members } = action.payload;
	const updatedFlatsTasks = {
		...state.flatsTasks,
	};

	const updatedFlatTasks = [...updatedFlatsTasks[flatId]];
	const editedTaskIndex = updatedFlatTasks.findIndex((x) => x.id === taskId);

	const updatedTask = new Task({
		...updatedFlatTasks[editedTaskIndex],
		members: members,
	});

	updatedFlatTasks[editedTaskIndex] = updatedTask;
	updatedFlatsTasks[flatId] = updatedFlatTasks;

	return {
		...state,
		flatsTasks: updatedFlatsTasks,
	};
};

const reducer: AppReducer<TasksState, TasksActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TasksActionTypes.Set:
			return setTasks(state, action);
		case TasksActionTypes.Add:
			return addTask(state, action);
		case TasksActionTypes.SetMembers:
			return setMembers(state, action);
		default:
			return state;
	}
};

export default reducer;
