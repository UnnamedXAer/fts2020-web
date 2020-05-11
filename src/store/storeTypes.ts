import User from '../models/user';
import { Action } from 'redux';
import Flat from '../models/flat';
import Task, { UserTask } from '../models/task';
import { TaskPeriod } from '../models/taskPeriod';

export type RootState = {
	auth: AuthState;
	flats: FlatsState;
	tasks: TasksState;
	users: UsersState;
	periods: PeriodsState
};

export type AuthState = {
	user: User | null;
	expirationTime: number | null;
};

export type UsersState = {
	users: { [id: number]: User };
};

export type FlatsState = {
	flats: Flat[];
	flatsLoadTime: number;
};

export type TasksState = {
	tasks: Task[];
	userTasks: UserTask[]
	userTasksLoadTime: number;
};

export type PeriodsState = {
	taskPeriods: {
		[taskId: number]: TaskPeriod[]
	}
}

export type AppReducer<TState, AType = string, APayload = any> = (
	state: TState,
	action: StoreAction<APayload, AType>
) => TState;

export type SimpleReducer<S, P> = (state: S, action: StoreAction<P>) => S;

type StoreActionPayload<T> = {
	payload: T;
};

export type StoreAction<P = any, A = string> = StoreActionPayload<P> &
	Action<A>;

export default RootState;
