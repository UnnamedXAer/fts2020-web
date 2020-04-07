import { AppReducer, TasksState, SimpleReducer } from '../storeTypes';
import { TasksActionTypes } from '../actions/actionTypes';
import Task from '../../models/task';

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

const reducer: AppReducer<TasksState, TasksActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TasksActionTypes.Set:
			return setTasks(state, action);
		case TasksActionTypes.Add:
			return addTask(state, action);
		default:
			return state;
	}
};

export default reducer;
