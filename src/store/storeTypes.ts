export type RootState = {
	auth: AuthState
}

export type AuthState = {
	emailAddress: string | null,
	userName: string | null,
	expirationTime: number | null,
}
export default RootState;


export type AppReducer<TState> = (
	state: TState,
	action: { type: string; [key: string]: any }
) => TState;