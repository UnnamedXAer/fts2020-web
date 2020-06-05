import { UsersState, AppReducer, SimpleReducer } from '../storeTypes';
import { UsersActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: UsersState = {
	users: [],
};

const setUser: SimpleReducer<UsersState, User> = (state, action) => {
	const updatedUsers = state.users.concat(action.payload);

	return {
		users: updatedUsers,
	};
};

const reducer: AppReducer<UsersState, UsersActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case UsersActionTypes.SetUser:
			return setUser(state, action);
		default:
			return state;
	}
};

export default reducer;
