import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task, { TaskPeriodUnit, UserTask } from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';

type FetchFlatTasksAction = {
	type: TasksActionTypes.SetFlatTasks;
	payload: {
		tasks: Task[];
		flatId: number;
	};
};

type FetchUserTasksAction = {
	type: TasksActionTypes.SetUserTasks;
	payload: UserTask[];
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

type APIUserTask = {
	id?: number;
	title: string;
	flatName?: string;
	flatId: number;
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
): ThunkAction<Promise<void>, RootState, any, FetchFlatTasksAction> => {
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
				type: TasksActionTypes.SetFlatTasks,
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

export const fetchUserTasks = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	FetchUserTasksAction
> => {
	return async (dispatch) => {
		const url = `/tasks`;
		try {
			const { data } = await axios.get<APIUserTask[]>(url);
			const tasks = data.map(
				(x) =>
					new UserTask({
						id: x.id,
						flatId: x.flatId,
						name: x.title,
						flatName: x.flatName,
						timePeriodUnit: x.timePeriodUnit,
						timePeriodValue: x.timePeriodValue,
						active: x.active,
					})
			);

			dispatch({
				type: TasksActionTypes.SetUserTasks,
				payload: tasks,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchTaskMembers = (
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		{ taskId: number; members: User[] },
		TasksActionTypes.SetMembers
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/members`;
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
					taskId
				},
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
