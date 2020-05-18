import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task, { TaskPeriodUnit, UserTask } from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';
import { APIUser } from './users';

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

type FetchTaskAction = {
	type: TasksActionTypes.SetTask;
	payload: Task;
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

export const fetchTask = (
	id: number
): ThunkAction<Promise<void>, RootState, any, FetchTaskAction> => {
	return async (dispatch) => {
		const url = `/tasks/${id}`;
		try {
			const { data } = await axios.get<APITask>(url);
			const task = new Task({
				id: data.id,
				flatId: data.flatId,
				name: data.title,
				description: data.description,
				startDate: new Date(data.startDate!),
				endDate: new Date(data.endDate!),
				timePeriodUnit: data.timePeriodUnit,
				timePeriodValue: data.timePeriodValue,
				active: data.active,
				createAt: new Date(data.createAt!),
				createBy: data.createBy,
			});
			dispatch({
				type: TasksActionTypes.SetTask,
				payload: task,
			});
		} catch (err) {
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
						createBy: x.createBy,
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
			const { data } = await axios.get<APIUser[]>(url);
			const members = data.map(
				(user) =>
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
			dispatch({
				type: TasksActionTypes.SetMembers,
				payload: {
					members,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchTaskOwner = (
	userId: number,
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<{ user: User; taskId: number }, TasksActionTypes.SetOwner>
> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.get(url);

			const user = new User(
				data.id,
				data.emailAddress,
				data.userName,
				data.provider,
				new Date(data.joinDate),
				data.avatarUrl,
				data.active
			);

			dispatch({
				type: TasksActionTypes.SetOwner,
				payload: {
					user,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updateTask = (
	task: Partial<Task>
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<Partial<Task>, string>
> => {
	return async (dispatch) => {
		const url = `/flats/tasks/${task.id}`;
		try {
			const requestPayload: Partial<APITask> = {
				title: task.name!,
				description: task.description,
				timePeriodUnit: task.timePeriodUnit,
				timePeriodValue: task.timePeriodValue,
				active: task.active,
			};
			const { data } = await axios.patch<APITask>(url, requestPayload);
			const updatedTask = new Task({
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
				type: TasksActionTypes.SetTask,
				payload: updatedTask,
			});
		} catch (err) {
			throw err;
		}
	};
};
