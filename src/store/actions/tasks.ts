import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task, { TaskPeriodUnit } from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';

type FetchTasksAction = {
	type: TasksActionTypes.Set;
	payload: {
		tasks: Task[];
		flatId: number;
	};
};

type APITask = {
	id?: number;
	title: string;
	description?: string;
	members?: number[];
	createBy?: number;
	createAt?: string;
	flatId: number;
	startDate?: string;
	endDate?: string;
	timePeriodUnit?: TaskPeriodUnit;
	timePeriodValue?: number;
	active?: boolean;
};

export const createTask = (
	task: Task
): ThunkAction<Promise<void>, RootState, any, StoreAction<Task, string>> => {
	return async (dispatch) => {
		const url = `/flats/${task.flatId}/tasks`;
		try {
			const requestPayload: APITask = {
				title: task.name!,
				description: task.description,
				members: task.members!.map((x) => x.id),
				flatId: task.flatId!,
				startDate: task.startDate?.toISOString(),
				endDate: task.endDate?.toISOString(),
				timePeriodUnit: task.timePeriodUnit,
				timePeriodValue: task.timePeriodValue,
			};
			const { data } = await axios.post<APITask>(url, requestPayload);
			const createdTask = new Task({
				id: data.id,
				name: data.title,
				description: data.description,
				createAt: new Date(data.createAt!),
				flatId: data.flatId,
				active: data.active,
				startDate: new Date(data.startDate!),
				endDate: new Date(data.endDate!),
				timePeriodUnit: data.timePeriodUnit,
				timePeriodValue: data.timePeriodValue,
			});
			dispatch({
				type: TasksActionTypes.Add,
				payload: createdTask,
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};

export const fetchFlatTasks = (
	id: number
): ThunkAction<Promise<void>, RootState, any, FetchTasksAction> => {
	return async (dispatch) => {
		const url = `/flats/${id}/tasks`;
		try {
			const { data } = await axios.get<APITask[]>(url);
			const tasks = data.map(
				(x) =>
					new Task({
						id: x.id,
						flatId: x.flatId,
						name: x.title,
						description: x.description,
						startDate: new Date(x.startDate!),
						endDate: new Date(x.endDate!),
						timePeriodUnit: x.timePeriodUnit,
						timePeriodValue: x.timePeriodValue,
						active: x.active,
						createAt: new Date(x.createAt!),
						createById: x.createBy,
					})
			);

			dispatch({
				type: TasksActionTypes.Set,
				payload: {
					flatId: id,
					tasks,
				},
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};

export const fetchTaskMembers = (
	flatId: number,
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		{ flatId: number; taskId: number; members: User[] },
		TasksActionTypes.SetMembers
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${flatId}/tasks/${taskId}/members`;
		try {
			const { data } = await axios.get(url);
			const members = data.map(
				(user: any) =>
					new User(
						user.id,
						user.emailAddress,
						user.userName,
						user.provider,
						new Date(user.joinDate),
						user.avatarUrl,
						user.active
					)
			);
			console.log(members);
			dispatch({
				type: TasksActionTypes.SetMembers,
				payload: {
					members,
					taskId,
					flatId,
				},
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
