import User from '../models/user';
import { Action } from 'redux';

export type RootState = {
	auth: AuthState;
};

export type AuthState = {
	user: User | null;
};

export type AppReducer<TState, APayload = any, AType = string> = (
	state: TState,
	action: StoreAction<APayload, AType>
) => TState;

type StoreActionPayload<T> = {
	payload: T;
};

export type StoreAction<P = any, A = string> = StoreActionPayload<P> &
	Action<A>;

export default RootState;
