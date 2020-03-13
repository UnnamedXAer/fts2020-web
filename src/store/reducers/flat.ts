import { AppReducer, FlatState, SimpleReducer } from '../storeTypes';
import { FlatActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';

const initialState: FlatState = {
	flats: [
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		new Flat({
			id: 1,
			address: 'South street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment',
			members: [1, 2, 3]
		}),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		// new Flat({
		// 	id: 1,
		// 	address: 'South street 123/12',
		// 	createAt: new Date(2020, 1, 5, 15, 35),
		// 	createBy: 1,
		// 	name: 'apartment',
		// 	members: [1, 2, 3]
		// }),
		new Flat({
			id: 2,
			address: 'North street 123/12',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 2020-01 -> 2020-06',
			members: [1, 2, 3]
		})
	]
};

const setFlats: SimpleReducer<FlatState, Flat[], FlatActionTypes.Set> = (
	state,
	action
) => {
	return {
		...state,
		flats: action.payload
	};
};

const reducer: AppReducer<FlatState, FlatActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatActionTypes.Set:
			return setFlats(state, action);
		default:
			return state;
	}
};

export default reducer;
