import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { TaskPeriodsTypes } from './actionTypes';
import axios from '../../axios/axios';
import { TaskPeriod } from '../../models/taskPeriod';
import User from '../../models/user';

type APITaskPeriod = {
	id: number;
	startDate: string;
	endDate: string;
	assignedTo: User;
	completedBy?: User;
	completedAt?: string;
};

export const fetchTaskPeriods = (
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		{ taskId: number; periods: TaskPeriod[] },
		TaskPeriodsTypes.SetTaskPeriods
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods`;
		try {
			const { data } = await axios.get<APITaskPeriod[]>(url);
			const periods = data.map(
				(period) =>
					new TaskPeriod({
						id: period.id,
						startDate: new Date(period.startDate),
						endDate: new Date(period.endDate),
						assignedTo: period.assignedTo,
						completedAt: period.completedAt
							? new Date(period.completedAt)
							: void 0,
						completedBy: period.completedBy,
					})
			);
			dispatch({
				type: TaskPeriodsTypes.SetTaskPeriods,
				payload: {
					periods,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};
