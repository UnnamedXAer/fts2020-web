import Flat from '../../models/flat';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import { FlatsActionTypes } from './actionTypes';
import axios from '../../axios/axios';

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
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<Flat, FlatsActionTypes.Add>
> => {
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
				owner: flat.owner
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
	StoreAction<Flat[], FlatsActionTypes.Set>
> => {
	return async (dispatch, getState) => {
		const loggedUser = getState().auth.user;
		const url = `/flats?userId=${loggedUser!.id}`;
		try {
			const { data } = await axios.get<APIFlat[]>(url);
			const flats = data.map(x => new Flat({ 
				id: x.id,
				name: x.name,
				description: x.description,
				owner: loggedUser!, // TODO -> fetch real owner
				createAt: x.createAt
			}));
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
