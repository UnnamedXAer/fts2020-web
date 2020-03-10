import { AuthState, AppReducer } from '../storeTypes';

const initialState: AuthState = {
	emailAddress: null,
	userName: null,
	expirationTime: null
};

const reducer: AppReducer<AuthState> = (state = initialState, action) => {
	return state;
};

export default reducer;
