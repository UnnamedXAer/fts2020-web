export const AUTHORIZE = 'AUTHORIZE';
export const LOGOUT = 'LOGOUT';

export enum AuthActionTypes {
	SetLoggedUser = 'AUTH_SET_LOGGEDUSER',
	UpdatePassword = 'AUTH_UPDATE_PASSWORD',
}

export enum FlatsActionTypes {
	Add = 'FLATS_ADD_FLAT',
	Set = 'FLATS_SET_FLATS',
	SetFlat = 'FLATS_SET_FLAT',
	SetOwner = 'FLATS_SET_FLAT_OWNER',
	SetMembers = 'FLATS_SET_FLAT_MEMBERS',
	SetInvitations = 'FLATS_SET_FLAT_INVITATIONS',
	SetInvitation = 'FLATS_SET_FLAT_INVITATION',
	ClearState = 'FLATS_CLEAR_STATE',
	ResetFlatsLoadTime = 'FLATS_RESET_FLATS_LOAD_TIME',
}

export enum TasksActionTypes {
	Add = 'TASKS_ADD_TASK',
	SetTask = 'TASKS_SET_TASK',
	SetFlatTasks = 'TASKS_SET_FLAT_TASKS',
	SetUserTasks = 'TASKS_SET_USER_TASKS',
	SetUserTask = 'TASKS_SET_USER_TASK',
	SetOwner = 'TASKS_SET_OWNER',
	SetMembers = 'TASKS_SET_MEMBERS',
	ClearState = 'TASKS_CLEAR_STATE',
}

export enum InvitationsActionTypes {
	SetUserInvitations = 'INVITATIONS_SET_USER_INVITATIONS',
	SetUserInvitation = 'INVITATIONS_SET_USER_INVITATION',
	ClearState = 'INVITATIONS_CLEAR_STATE',
}

export enum TaskPeriodsActionTypes {
	SetTaskPeriods = 'PERIODS_SET_TASK_PERIODS',
	CompletePeriod = 'PERIODS_COMPLETE_PERIOD',
	ClearTaskPeriods = 'PERIODS_CLEAR_TASK_PERIODS',
	SetCurrentPeriods = 'PERIODS_SET_CURRENT_PERIODS',
	ClearState = 'PERIODS_CLEAR_STATE',
}

export enum UsersActionTypes {
	SetUser = 'USERS_SET',
	UpdateUser = 'USERS_UPDATE',
	ClearState = 'USERS_CLEAR_STATE',
}
