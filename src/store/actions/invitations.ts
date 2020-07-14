import axios from '../../axios/axios';
import { InvitationsActionTypes } from './actionTypes';
import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import {
	InvitationPresentation,
	APIInvitationPresentation,
	InvitationAction,
} from '../../models/invitation';
import { APIInvitation } from './flats';

type FetchUserInvitationsAction = {
	type: InvitationsActionTypes.SetUserInvitations;
	payload: InvitationPresentation[];
};

type FetchUserInvitationAction = {
	type: InvitationsActionTypes.SetUserInvitation;
	payload: InvitationPresentation;
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

export const fetchUserInvitation = (
	token: string
): ThunkAction<Promise<void>, RootState, any, FetchUserInvitationAction> => {
	return async (dispatch) => {
		const url = `/invitations/${token}`;
		try {
			const { data, status } = await axios.get<APIInvitationPresentation>(
				url
			);
			if (status === 200) {
				const invitation = new InvitationPresentation(data);
				dispatch({
					type: InvitationsActionTypes.SetUserInvitation,
					payload: invitation,
				});
			} else {
				throw new Error(
					'Un-authorized access, you do not have permissions to maintain this invitation.'
				);
			}
		} catch (err) {
			throw err;
		}
	};
};
export const answerUserInvitations = (
	id: InvitationPresentation['id'],
	action: InvitationAction.ACCEPT | InvitationAction.REJECT
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	{
		type: InvitationsActionTypes.SetUserInvitation;
		payload: InvitationPresentation;
	}
> => {
	return async (dispatch, getState) => {
		const url = `/invitations/${id}`;
		try {
			const { data } = await axios.patch<APIInvitation>(url, {
				action: action,
			});
			const state = getState();
			const loggedUser = state.auth.user!;
			const invitation = state.invitations.userInvitations.find(
				(x) => x.id === id
			);

			if (invitation) {
				dispatch({
					type: InvitationsActionTypes.SetUserInvitation,
					payload: {
						...invitation,
						status: data.status,
						actionBy: loggedUser,
						actionDate: new Date(data.actionDate!),
					},
				});
			}
		} catch (err) {
			throw err;
		}
	};
};
