import { AppReducer, SimpleReducer, InvitationsState } from '../storeTypes';
import { InvitationsActionTypes } from '../actions/actionTypes';
import { InvitationPresentation } from '../../models/invitation';

const initialState: InvitationsState = {
	userInvitations: [],
	userInvitationsLoadTime: 0,
};

const setUserInvitations: SimpleReducer<
	InvitationsState,
	InvitationPresentation[]
> = (state, action) => {
	return {
		...state,
		userInvitations: action.payload,
		userInvitationsLoadTime: Date.now(),
	};
};

const setUserInvitation: SimpleReducer<
	InvitationsState,
	InvitationPresentation
> = (state, action) => {
	const invitation = action.payload;
	const updatedInvitations = [...state.userInvitations];
	const idx = updatedInvitations.findIndex((x) => x.id === invitation.id);
	if (idx === -1) {
		updatedInvitations.push(invitation);
	} else {
		updatedInvitations[idx] = invitation;
	}

	return {
		...state,
		userInvitations: updatedInvitations,
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
		case InvitationsActionTypes.SetUserInvitation:
			return setUserInvitation(state, action);
		case InvitationsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
