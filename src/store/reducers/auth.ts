import { AuthState, AppReducer, StoreAction } from '../storeTypes';
import { AUTHORIZE, LOGOUT } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: AuthState = {
	user: null,
	expirationTime: null
};

type AuthActionPayload = { user: User; expirationTime: number };

type Reducer<T = AuthActionPayload> = (
	state: AuthState,
	action: StoreAction<T>
) => AuthState;

const logIn: Reducer = (_, action) => {
	return {
		user: action.payload.user,
		expirationTime: action.payload.expirationTime
	};
};

const logOut: Reducer<void> = () => {
	return {
		...initialState
	};
};

const reducer: AppReducer<AuthState> = (state = initialState, action) => {
	switch (action.type) {
		case AUTHORIZE:
			return logIn(state, action);
		case LOGOUT:
			return logOut(state, action);

		default:
			break;
	}
	return state;
};

export default reducer;
