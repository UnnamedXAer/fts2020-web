import Flat from '../../models/flat';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { FlatsActionTypes } from './actionTypes';
import axios from '../../axios/axios';
import User from '../../models/user';

type APIFlat = {
	id: number;
	name: string;
	description: string;
	members?: number[];
	createBy: number;
	createAt: Date;
};

export const createFlat = (
	flat: Flat
): ThunkAction<Promise<void>, RootState, any, StoreAction<Flat, string>> => {
	return async dispatch => {
		const url = '/flats';
		try {
			const requestPayload = {
				name: flat.name,
				description: flat.description,
				members: flat.members!.map(x => x.id)
			};
			const { data } = await axios.post<APIFlat>(url, requestPayload);
			const createdFlat = new Flat({
				id: data.id,
				name: data.name,
				description: data.description,
				createAt: data.createAt,
				ownerId: data.createBy
			});
			dispatch({
				type: FlatsActionTypes.Add,
				payload: createdFlat
			});
		} catch (err) {
			console.log(err);
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
				x =>
					new Flat({
						id: x.id,
						name: x.name,
						description: x.description,
						ownerId: x.createBy,
						createAt: x.createAt
					})
			);
			dispatch({
				type: FlatsActionTypes.Set,
				payload: flats
			});
		} catch (err) {
			console.log(err);
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
	return async dispatch => {
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
					flatId
				}
			});
		} catch (err) {
			console.log(err);
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
	StoreAction<User[], FlatsActionTypes.SetMembers>
> => {
	return async dispatch => {
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
			console.log(members);
			dispatch({
				type: FlatsActionTypes.SetMembers,
				payload: members
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
