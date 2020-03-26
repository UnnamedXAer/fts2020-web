import { AppReducer, TasksState, SimpleReducer } from '../storeTypes';
import { TasksActionTypes } from '../actions/actionTypes';
import Task from '../../models/task';

const initialState: TasksState = {
	flatsTasks: {}
};

const setFlats: SimpleReducer<
	TasksState,
	{ flatId: number; tasks: Task[] },
	TasksActionTypes.Set
> = (state, action) => {
	const updatedFlatsTasks = {
		...state.flatsTasks,
		[action.payload.flatId]: action.payload.tasks
	};

	return {
		...state,
		flatsTasks: updatedFlatsTasks
	};
};


const reducer: AppReducer<TasksState, TasksActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TasksActionTypes.Set:
			return setFlats(state, action);
		default:
			return state;
	}
};

export default reducer;