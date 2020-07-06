import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task, { TaskPeriodUnit, UserTask } from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';
import { APIUser, mapApiUserDataToModel } from './users';

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

export type AddTaskActionPayload = {
	task: Task;
	userTask: UserTask;
};

type SetTaskMembersAction = {
	type: TasksActionTypes.SetMembers;
	payload: { members: User[]; taskId: number };
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
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<AddTaskActionPayload, string>
> => {
	return async (dispatch, getState) => {
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
			const createdTask = mapApiTaskDataToModel(data);
			const flatName = getState().flats.flats.find(
				(x) => x.id === createdTask.flatId
			)!.name;
			const userTask = mapApiUserTaskDataToModel({
				...data,
				flatName: flatName,
			});
			dispatch({
				type: TasksActionTypes.Add,
				payload: { task: createdTask, userTask },
			});
		} catch (err) {
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
			const task = mapApiTaskDataToModel(data);
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
			const tasks = data.map(mapApiTaskDataToModel);

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
			const tasks = data.map(mapApiUserTaskDataToModel);

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
): ThunkAction<Promise<void>, RootState, any, SetTaskMembersAction> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/members`;
		try {
			const { data } = await axios.get<APIUser[]>(url);
			const members = data.map(mapApiUserDataToModel);
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
			const { data } = await axios.get<APIUser>(url);

			const user = mapApiUserDataToModel(data);

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
		const url = `/tasks/${task.id}`;
		try {
			const requestPayload: Partial<APITask> = {
				title: task.name!,
				description: task.description,
				timePeriodUnit: task.timePeriodUnit,
				timePeriodValue: task.timePeriodValue,
				active: task.active,
			};
			const { data } = await axios.patch<APITask>(url, requestPayload);
			const updatedTask = mapApiTaskDataToModel(data);
			dispatch({
				type: TasksActionTypes.SetTask,
				payload: updatedTask,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updatedTaskMembers = (
	taskId: number,
	members: number[]
): ThunkAction<Promise<void>, RootState, any, SetTaskMembersAction> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/members`;
		try {
			const { data } = await axios.put<APIUser[]>(url, { members });
			const taskMembers = data.map(mapApiUserDataToModel);
			dispatch({
				type: TasksActionTypes.SetMembers,
				payload: { taskId, members: taskMembers },
			});
		} catch (err) {
			throw err;
		}
	};
};

const mapApiTaskDataToModel = (data: APITask) =>
	new Task({
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

const mapApiUserTaskDataToModel = (data: APIUserTask) =>
	new UserTask({
		id: data.id,
		flatId: data.flatId,
		name: data.title,
		flatName: data.flatName,
		timePeriodUnit: data.timePeriodUnit,
		timePeriodValue: data.timePeriodValue,
		active: data.active,
	});
