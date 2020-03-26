import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';

type FetchTasksAction = {
	type: TasksActionTypes.Set;
	payload: {
		tasks: Task[];
		flatId: number;
	};
};

export const fetchFlatTasks = (
	id: number
): ThunkAction<Promise<void>, RootState, any, FetchTasksAction> => {
	return async dispatch => {
		const url = `/flats/${id}/tasks`;
		try {
			const { data }: { data: any } = await axios.get(url);
			const tasks = [data.map((x: any) => new Task())];
			dispatch({
				type: TasksActionTypes.Set,
				payload: {
					flatId: id,
					tasks
				}
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
