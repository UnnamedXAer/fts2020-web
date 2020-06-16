import { UsersState, AppReducer, SimpleReducer } from '../storeTypes';
import { UsersActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: UsersState = {
	users: [],
};

const setUser: SimpleReducer<UsersState, User> = (state, action) => {
	const user = action.payload;
	const updatedUsers = { ...state.users };

	const idx = updatedUsers.findIndex((x) => x.id === user.id);
	if (idx === -1) {
		updatedUsers.push(user);
	} else {
		updatedUsers[idx] = user;
	}

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
