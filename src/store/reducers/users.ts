import { UsersState, AppReducer, SimpleReducer } from '../storeTypes';
import { UsersActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: UsersState = {
	users: [],
};

const setUser: SimpleReducer<UsersState, User> = (state, action) => {
	const user = action.payload;
	const updatedUsers = [...state.users];

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

const clearState: SimpleReducer<UsersState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<UsersState, UsersActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case UsersActionTypes.SetUser:
			return setUser(state, action);
		case UsersActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
