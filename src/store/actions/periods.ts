import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { TaskPeriodsActionTypes } from './actionTypes';
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
	StoreAction<
		SetTaskPeriodsActionPayload,
		TaskPeriodsActionTypes.SetTaskPeriods
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods`;
		try {
			const { data } = await axios.get<APITaskPeriod[]>(url);
			const periods = data.map(mapApiPeriodDataToModel);
			dispatch({
				type: TaskPeriodsActionTypes.SetTaskPeriods,
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
	StoreAction<
		CompletePeriodActionPayload,
		TaskPeriodsActionTypes.CompletePeriod
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods/${id}/complete`;
		try {
			const { data } = await axios.patch<APITaskPeriod>(url);
			const period = mapApiPeriodDataToModel(data);
			dispatch({
				type: TaskPeriodsActionTypes.CompletePeriod,
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

export const resetTaskPeriods = (
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		SetTaskPeriodsActionPayload,
		TaskPeriodsActionTypes.SetTaskPeriods
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/periods`;
		try {
			const { data } = await axios.put<APITaskPeriod[]>(url);

			const periods = data.map(mapApiPeriodDataToModel);

			dispatch({
				type: TaskPeriodsActionTypes.SetTaskPeriods,
				payload: { taskId, periods },
			});
		} catch (err) {
			throw err;
		}
	};
};

export const clearTaskPeriods = (
	taskId: number
): StoreAction<{ taskId: number }, TaskPeriodsActionTypes.ClearTaskPeriods> => {
	return {
		type: TaskPeriodsActionTypes.ClearTaskPeriods,
		payload: { taskId },
	};
};

const mapApiPeriodDataToModel = (period: APITaskPeriod) =>
	new Period({
		id: period.id,
		startDate: new Date(period.startDate),
		endDate: new Date(period.endDate),
		assignedTo: period.assignedTo,
		completedAt: period.completedAt ? new Date(period.completedAt) : null,
		completedBy: period.completedBy,
	});
