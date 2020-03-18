import User from '../models/user';
import { Action } from 'redux';
import Flat from '../models/flat';

export type RootState = {
	auth: AuthState;
	flats: FlatState;
};

export type AuthState = {
	user: User | null;
	expirationTime: number | null;
};

export type FlatState = {
	flats: Flat[]
};

export type AppReducer<TState, AType = string, APayload = any> = (
	state: TState,
	action: StoreAction<APayload, AType>
) => TState;

export type SimpleReducer<S, P, A> = (state: S, action: StoreAction<P, A>) => S;

type StoreActionPayload<T> = {
	payload: T;
};

export type StoreAction<P = any, A = string> = StoreActionPayload<P> &
	Action<A>;

export default RootState;
