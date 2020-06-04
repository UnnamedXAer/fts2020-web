export const AUTHORIZE = 'AUTHORIZE';
export const LOGOUT = 'LOGOUT';

export enum AuthActionTypes {
	UpdatePassword = 'USER_UPDATE_PASSWORD',
}

export enum FlatsActionTypes {
	Set = 'FLAT_SET',
	Add = 'FLAT_ADD',
	SetOwner = 'FLAT_SET_OWNER',
	SetMembers = 'FLAT_SET_MEMBERS',
	SetInvitations = 'FLAT_SET_INVITATIONS',
	SetInvitation = 'FLAT_SET_INVITATION',
	ClearState = 'FLAT_CLEAR_STATE',
}

export enum TasksActionTypes {
	Add = 'TASK_ADD',
	SetTask = 'TASK_SET',
	SetOwner = 'TASK_SET_OWNER',
	SetFlatTasks = 'TASK_SET_FLAT_TASKS',
	SetUserTasks = 'TASK_SET_USER_TASKS',
	SetMembers = 'TASK_SET_MEMBERS',
	ClearState = 'TASK_CLEAR_STATE',
}

export enum TaskPeriodsTypes {
	SetTaskPeriods = 'PERIOD_SET_TASK_PERIODS',
	CompletePeriod = 'PERIOD_COMPLETE',
}

export enum UsersActionTypes {
	SetUser = 'USER_SET',
	UpdateUser = 'USER_UPDATE',
}
