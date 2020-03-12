import { AuthState, AppReducer, StoreAction } from '../storeTypes';
import { AUTHORIZE } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: AuthState = {
	user: null
};

type Reducer = (state: AuthState, action: StoreAction<User>) => AuthState;

const logIn: Reducer = (state, action) => {
	return {
		user: action.payload
	};
}

const reducer: AppReducer<AuthState> = (state = initialState, action) => {
	switch (action.type) {
		case AUTHORIZE: return logIn(state, action);
	
		default:
			break;
	}
	return state;
};

export default reducer;
