import axios from '../../axios/axios';
import { InvitationsActionTypes } from './actionTypes';
import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import {
	InvitationPresentation,
	APIInvitationPresentation,
} from '../../models/invitation';

type FetchUserInvitationsAction = {
	type: InvitationsActionTypes.SetUserInvitations;
	payload: InvitationPresentation[];
};

export const fetchUserInvitations = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	FetchUserInvitationsAction
> => {
	return async (dispatch) => {
		const url = `/invitations`;
		try {
			const { data } = await axios.get<APIInvitationPresentation[]>(url);
			const invitations = data.map((x) => new InvitationPresentation(x));

			dispatch({
				type: InvitationsActionTypes.SetUserInvitations,
				payload: invitations,
			});
		} catch (err) {
			throw err;
		}
	};
};
