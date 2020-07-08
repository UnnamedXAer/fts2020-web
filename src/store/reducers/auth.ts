import {
	AuthState,
	AppReducer,
	StoreAction,
	SimpleReducer,
} from '../storeTypes';
import { AUTHORIZE, LOGOUT, AuthActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: AuthState = {
	user: null,
	expirationTime: null,
};

type AuthActionPayload = { user: User; expirationTime: number };

type Reducer<T = AuthActionPayload> = (
	state: AuthState,
	action: StoreAction<T>
) => AuthState;

const setLoggedUser: SimpleReducer<AuthState, User> = (state, action) => {
	return {
		...state,
		user: action.payload,
	};
};

const logIn: Reducer = (_, action) => {
	return {
		user: action.payload.user,
		expirationTime: action.payload.expirationTime,
	};
};

const logOut: Reducer<void> = () => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<AuthState> = (state = initialState, action) => {
	switch (action.type) {
		case AUTHORIZE:
			return logIn(state, action);
		case LOGOUT:
			return logOut(state, action);
		case AuthActionTypes.SetLoggedUser:
			return setLoggedUser(state, action);
		case AuthActionTypes.UpdatePassword:
			return state;
		default:
			return state;
	}
};

export default reducer;
