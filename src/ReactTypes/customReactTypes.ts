export type StateError = string | null;
export enum TaskSpeedActions {
	AddMember,
	CloseTask,
	ResetPeriods,
}

export enum FlatSpeedActions {
	AddMember,
	CloseFlat,
	AddTask,
}