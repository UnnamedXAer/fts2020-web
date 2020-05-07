import { AppReducer, TasksState, SimpleReducer } from '../storeTypes';
import { TasksActionTypes } from '../actions/actionTypes';
import Task from '../../models/task';
import User from '../../models/user';

const initialState: TasksState = {
	tasks: [],
	userTasks: [],
	userTasksLoadTime: 0,
};

const setUserTasks: SimpleReducer<TasksState, Task[]> = (state, action) => {
	return {
		...state,
		userTasks: action.payload,
		userTasksLoadTime: Date.now(),
	};
};

const setTask: SimpleReducer<TasksState, Task> = (state, action) => {
	const task = action.payload;
	const updatedTasks = [...state.tasks];

	const taskIdx = updatedTasks.findIndex((x) => x.id === task.id);
	if (taskIdx === -1) {
		updatedTasks.push(task);
	} else {
		updatedTasks[taskIdx] = task;
	}

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setFlatTasks: SimpleReducer<
	TasksState,
	{ flatId: number; tasks: Task[] }
> = (state, action) => {
	const { flatId, tasks } = action.payload;
	const updatedTasks = state.tasks.filter((x) => x.flatId !== flatId);

	updatedTasks.concat(tasks);

	return {
		...state,
		tasks: updatedTasks,
	};
};

const addTask: SimpleReducer<TasksState, Task> = (state, action) => {
	const updatedTasks = state.tasks.concat(action.payload);

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setMembers: SimpleReducer<
	TasksState,
	{ taskId: number; members: User[] }
> = (state, action) => {
	const { taskId, members } = action.payload;
	const updatedTasks = [...state.tasks];

	const editedTaskIndex = updatedTasks.findIndex((x) => x.id === taskId);

	const updatedTask = new Task({
		...updatedTasks[editedTaskIndex],
		members: members,
	});

	updatedTasks[editedTaskIndex] = updatedTask;

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setOwner: SimpleReducer<
	TasksState,
	{ taskId: number; user: User }
> = (state, action) => {
	const { taskId, user } = action.payload;
	const updatedTasks = [...state.tasks];

	const editedTaskIndex = updatedTasks.findIndex((x) => x.id === taskId);

	const updatedTask = new Task({
		...updatedTasks[editedTaskIndex],
		owner: user,
	});

	updatedTasks[editedTaskIndex] = updatedTask;

	return {
		...state,
		tasks: updatedTasks,
	};
};

const clearState: SimpleReducer<TasksState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<TasksState, TasksActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TasksActionTypes.SetTask:
			return setTask(state, action);
		case TasksActionTypes.SetFlatTasks:
			return setFlatTasks(state, action);
		case TasksActionTypes.SetUserTasks:
			return setUserTasks(state, action);
		case TasksActionTypes.Add:
			return addTask(state, action);
		case TasksActionTypes.SetMembers:
			return setMembers(state, action);
		case TasksActionTypes.SetOwner:
			return setOwner(state, action);
		case TasksActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
