import { UsersState, AppReducer, SimpleReducer } from '../storeTypes';
import { UsersActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: UsersState = {
	users: {},
};

const fetchUser: SimpleReducer<UsersState, User> = (state, action) => {
	const updatedUsers = {
		...state.users,
		[action.payload.id]: action.payload,
	};

	return {
		users: updatedUsers,
	};
};

const reducer: AppReducer<UsersState, UsersActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case UsersActionTypes.FetchUser:
			return fetchUser(state, action);
		default:
			return state;
	}
};

export default reducer;
