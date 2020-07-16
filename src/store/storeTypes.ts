import User from '../models/user';
import { Action } from 'redux';
import Flat from '../models/flat';
import Task, { UserTask } from '../models/task';
import { CurrentPeriod, Period } from '../models/period';
import { InvitationPresentation } from '../models/invitation';

export type RootState = {
	settings: SettingsState;
	auth: AuthState;
	flats: FlatsState;
	tasks: TasksState;
	users: UsersState;
	periods: PeriodsState;
	invitations: InvitationsState;
};

export type SettingsState = {
	cookieVisible: boolean;
};

export type AuthState = {
	user: User | null;
	expirationTime: number | null;
};

export type UsersState = {
	users: User[];
};

export type FlatsState = {
	flats: Flat[];
	flatsLoadTime: number;
	createdFlatsTmpIds: { [key: string]: number | undefined };
};

export type TasksState = {
	tasks: Task[];
	flatTasksLoadTime: { [key: number]: number };
	userTasks: UserTask[];
	userTasksLoadTime: number;
};

export type InvitationsState = {
	userInvitations: InvitationPresentation[];
	userInvitationsLoadTime: number;
};

export type PeriodsState = {
	taskPeriods: {
		[taskId: number]: Period[];
	};
	currentPeriods: CurrentPeriod[] | null;
};

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
