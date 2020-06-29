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
import { mapApiUserDataToModel } from './users';

export type APIFlat = {
	id: number;
	name: string;
	description: string;
	members?: number[];
	createBy: number;
	createAt: string;
	active: boolean;
};

export type APIInvitation = {
	id: number;
	token: string;
	flatId: number;
	createBy: number;
	createAt: string;
	emailAddress: User['emailAddress'];
	actionDate: string | null;
	sendDate: string | null;
	status: InvitationStatus;
	actionBy: number | null;
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
			const createdFlat = mapAPIFlatDataToModel(data);

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
			const flats = data.map(mapAPIFlatDataToModel);
			dispatch({
				type: FlatsActionTypes.Set,
				payload: flats,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlat = (
	id: number
): ThunkAction<Promise<void>, RootState, any, StoreAction<Flat, string>> => {
	return async (dispatch) => {
		const url = `/flats/${id}`;
		try {
			const { data } = await axios.get<APIFlat>(url);
			const flat = mapAPIFlatDataToModel(data);
			dispatch({
				type: FlatsActionTypes.SetFlat,
				payload: flat,
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

			const user = mapApiUserDataToModel(data);

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

			const members = data.map(mapApiUserDataToModel);
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
				active: flat.active,
			};
			const { data } = await axios.patch<APIFlat>(url, requestPayload);
			const updatedTask = mapAPIFlatDataToModel(data);
			dispatch({
				type: FlatsActionTypes.SetFlat,
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

			const invitations = data.map(mapAPIInvitationDataToModel);
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
			const updatedInvitation = mapAPIInvitationDataToModel(data);

			dispatch({
				type: FlatsActionTypes.SetInvitation,
				payload: { invitation: updatedInvitation, flatId },
			});
		} catch (err) {
			throw err;
		}
	};
};

export const resetFlatsLoadTime = (): StoreAction<
	undefined,
	FlatsActionTypes.ResetFlatsLoadTime
> => ({ type: FlatsActionTypes.ResetFlatsLoadTime, payload: void 0 });

export const mapAPIFlatDataToModel = (data: APIFlat) =>
	new Flat({
		id: data.id,
		description: data.description,
		name: data.name,
		ownerId: data.createBy,
		createAt:
			typeof data.createAt === 'string'
				? new Date(data.createAt)
				: data.createAt,
		active: data.active,
	});

export const mapAPIInvitationDataToModel = (data: APIInvitation) =>
	new Invitation({
		id: data.id,
		token: data.token,
		createAt: data.createAt,
		actionDate: data.actionDate,
		emailAddress: data.emailAddress,
		createBy: data.createBy,
		sendDate: data.sendDate,
		status: data.status,
	});
