export type StateError = string | null;
export enum TaskSpeedActions {
	UpdateMembers,
	CloseTask,
	ResetPeriods,
}

export enum FlatSpeedActions {
	InviteMember,
	CloseFlat,
	AddTask,
}