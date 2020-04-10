export const AUTHORIZE = 'AUTHORIZE';
export const LOGOUT = 'LOGOUT';

export enum FlatsActionTypes {
	Set = 'FLAT_SET',
	Add = 'FLAT_ADD',
	SetOwner = 'FLAT_SET_OWNER',
	SetMembers = 'FLAT_SET_MEMBERS',
	ClearState = 'FLAT_CLEAR_STATE',
}

export enum TasksActionTypes {
	Set = 'TASK_SET',
	Add = 'TASK_ADD',
	SetMembers = 'FLAT_TASK_SET_MEMBERS',
	ClearState = 'TASK_CLEAR_STATE',
}

export enum UsersActionTypes {
	SetUser = 'USER_SET',
	UpdateUser = 'USER_UPDATE'
}
