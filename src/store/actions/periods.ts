import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { TaskPeriodsTypes } from './actionTypes';
import axios from '../../axios/axios';
import { Period, PeriodUser } from '../../models/period';

type APITaskPeriod = {
	id: number;
	taskId: number;
	startDate: string;
	endDate: string;
	assignedTo: PeriodUser;
	completedBy: PeriodUser | null;
	completedAt: string | null;
};

export type SetTaskPeriodsActionPayload = {
	taskId: number;
	periods: Period[];
};

export type CompletePeriodActionPayload = {
	period: Period;
	taskId: number;
};

export const fetchTaskPeriods = (
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<SetTaskPeriodsActionPayload, TaskPeriodsTypes.SetTaskPeriods>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods`;
		try {
			const { data } = await axios.get<APITaskPeriod[]>(url);
			const periods = data.map(
				(period) =>
					new Period({
						id: period.id,
						startDate: new Date(period.startDate),
						endDate: new Date(period.endDate),
						assignedTo: period.assignedTo,
						completedAt: period.completedAt
							? new Date(period.completedAt)
							: null,
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

export const completePeriod = (
	id: number,
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<CompletePeriodActionPayload, TaskPeriodsTypes.CompletePeriod>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods/${id}/complete`;
		try {
			const { data } = await axios.patch<APITaskPeriod>(url);
			const period = new Period({
						id: data.id,
						startDate: new Date(data.startDate),
						endDate: new Date(data.endDate),
						assignedTo: data.assignedTo,
						completedAt: data.completedAt
							? new Date(data.completedAt)
							: null,
						completedBy: data.completedBy,
					})
			dispatch({
				type: TaskPeriodsTypes.CompletePeriod,
				payload: {
					period,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};
