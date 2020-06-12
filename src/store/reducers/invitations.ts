import { AppReducer, SimpleReducer, InvitationsState } from '../storeTypes';
import { InvitationsActionTypes } from '../actions/actionTypes';
import { InvitationPresentation } from '../../models/invitation';

const initialState: InvitationsState = {
	userInvitations: [],
	userInvitationsLoadTime: 0,
};

const setUserInvitations: SimpleReducer<InvitationsState, InvitationPresentation[]> = (
	state,
	action
) => {
	return {
		...state,
		userInvitations: action.payload,
		userInvitationsLoadTime: Date.now(),
	};
};

const clearState: SimpleReducer<InvitationsState, undefined> = (
	state,
	action
) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<InvitationsState, InvitationsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case InvitationsActionTypes.SetUserInvitations:
			return setUserInvitations(state, action);
		case InvitationsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
