export type StateError = string | null;
export enum TaskSpeedActions {
	AddMember,
	CloseTask,
	ResetPeriods,
}

export enum FlatSpeedActions {
	InviteMember,
	CloseFlat,
	AddTask,
}