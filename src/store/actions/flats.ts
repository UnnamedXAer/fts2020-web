import Flat, { FlatData } from '../../models/flat';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { FlatsActionTypes } from './actionTypes';
import axios from '../../axios/axios';
import User from '../../models/user';
import Invitation, {
	InvitationStatus,
	InvitationAction,
} from '../../models/invitation';

type APIFlat = {
	id: number;
	name: string;
	description: string;
	members?: number[];
	createBy: number;
	createAt: Date;
};

type APIInvitation = {
	id: number;
	flatId: number;
	createBy: number;
	createAt: string;
	emailAddress: User['emailAddress'];
	actionDate: string | null;
	sendDate: string | null;
	status: InvitationStatus;
};

export type AddFlatActionPayload = { flat: Flat; tmpId: string };
export type SetFlatInvitationsActionPayload = {
	flatId: number;
	invitations: Invitation[];
};

export type UpdateInvitationActionPayload = {
	invitation: Invitation;
	flatId: number;
};

export const createFlat = (
	flat: FlatData,
	tmpId: string
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<AddFlatActionPayload, string>
> => {
	return async (dispatch) => {
		const url = '/flats';
		try {
			const { data } = await axios.post<APIFlat>(url, flat);
			const createdFlat = new Flat({
				id: data.id,
				name: data.name,
				description: data.description,
				createAt: data.createAt,
				ownerId: data.createBy,
			});

			dispatch({
				type: FlatsActionTypes.Add,
				payload: {
					flat: createdFlat,
					tmpId: tmpId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlats = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<Flat[], string>
> => {
	return async (dispatch, getState) => {
		const loggedUser = getState().auth.user;
		const url = `/flats?userId=${loggedUser!.id}`;
		try {
			const { data } = await axios.get<APIFlat[]>(url);
			const flats = data.map(
				(x) =>
					new Flat({
						id: x.id,
						name: x.name,
						description: x.description,
						ownerId: x.createBy,
						createAt: x.createAt,
					})
			);
			dispatch({
				type: FlatsActionTypes.Set,
				payload: flats,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatOwner = (
	userId: number,
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<{ user: User; flatId: number }, FlatsActionTypes.SetOwner>
> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.get(url);

			const user = new User(
				data.id,
				data.emailAddress,
				data.userName,
				data.provider,
				new Date(data.joinDate),
				data.avatarUrl,
				data.active
			);

			dispatch({
				type: FlatsActionTypes.SetOwner,
				payload: {
					user,
					flatId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatMembers = (
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		{ flatId: number; members: User[] },
		FlatsActionTypes.SetMembers
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${flatId}/members`;
		try {
			const { data } = await axios.get(url);

			const members = data.map(
				(user: any) =>
					new User(
						user.id,
						user.emailAddress,
						user.userName,
						user.provider,
						new Date(user.joinDate),
						user.avatarUrl,
						user.active
					)
			);
			dispatch({
				type: FlatsActionTypes.SetMembers,
				payload: {
					members,
					flatId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updateFlat = (
	flat: Partial<FlatData>
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<Partial<Flat>, string>
> => {
	return async (dispatch) => {
		const url = `/flats/${flat.id}`;
		try {
			const requestPayload: Partial<APIFlat> = {
				name: flat.name!,
				description: flat.description,
				// active: flat.active,
			};
			const { data } = await axios.patch<APIFlat>(url, requestPayload);
			const updatedTask = new Flat({
				id: data.id,
				name: data.name,
				description: data.description,
				createAt: new Date(data.createAt!),
				ownerId: data.createBy,
			});
			dispatch({
				type: FlatsActionTypes.Set,
				payload: updatedTask,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatInvitations = (
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		SetFlatInvitationsActionPayload,
		FlatsActionTypes.SetInvitations
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${flatId}/invitations`;
		try {
			const { data } = await axios.get<APIInvitation[]>(url);

			const invitations = data.map(
				(inv) =>
					new Invitation({
						id: inv.id,
						createBy: inv.createBy,
						createAt: inv.createAt,
						emailAddress: inv.emailAddress,
						actionDate: inv.actionDate,
						sendDate: inv.sendDate,
						status: inv.status,
					})
			);
			dispatch({
				type: FlatsActionTypes.SetInvitations,
				payload: {
					invitations,
					flatId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updateInvitation = (
	id: number,
	flatId: number,
	action: InvitationAction
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<UpdateInvitationActionPayload, FlatsActionTypes.SetInvitation>
> => {
	return async (dispatch) => {
		const url = `/invitations/${id}`;
		try {
			const { data } = await axios.patch<APIInvitation>(url, { action });
			const updatedInvitation = new Invitation({
				id: data.id,
				createAt: data.createAt,
				actionDate: data.actionDate,
				emailAddress: data.emailAddress,
				createBy: data.createBy,
				sendDate: data.sendDate,
				status: data.status,
			});

			dispatch({
				type: FlatsActionTypes.SetInvitation,
				payload: { invitation: updatedInvitation, flatId },
			});
		} catch (err) {
			throw err;
		}
	};
};
