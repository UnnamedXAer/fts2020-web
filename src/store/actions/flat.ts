import Flat from '../../models/flat';
import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import { FlatActionTypes } from './actionTypes';
import axios from '../../axios/axios';

type SetFlatAction = {
	type: FlatActionTypes.Set,
	flat: Flat
}

export const fetchFlats = () => {

};

export const setFlat = (
			flat: Flat,
		): ThunkAction<Promise<void>, RootState, any, SetFlatAction> => {
			return async (dispatch, getState) => {
				const url = `/flats/${flat.id ? flat.id : ''}`;
				try {
					let data: Flat;
					if (flat.id) {
						data = flat;
					}
					else {
						data = (await axios.post(url, flat)).data;
					}
					const savedFlat = new Flat({
						id: data.id,
						name: data.name,
						description: data.description,
						members: data.members,
						createBy: data.createBy,
						createAt: data.createAt
					});

					const action: SetFlatAction = {
						type: FlatActionTypes.Set,
						flat: savedFlat
					}
					dispatch(action);
				} catch (err) {
					throw err;
				}
			};
		};