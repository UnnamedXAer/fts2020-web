import { AppReducer, FlatsState, SimpleReducer } from '../storeTypes';
import { FlatsActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';
import User from '../../models/user';

const initialState: FlatsState = {
	flats: [],
	flatsLoadTime: 0
};

const setFlats: SimpleReducer<FlatsState, Flat[]> = (state, action) => {
	return {
		...state,
		flats: action.payload,
		flatsLoadTime: Date.now(),
	};
};

const addFlat: SimpleReducer<FlatsState, Flat> = (state, action) => {
	return {
		...state,
		flats: state.flats.concat(action.payload)
	};
};

const setOwner: SimpleReducer<FlatsState, { user: User; flatId: number }> = (
	state,
	action
) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		x => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		owner: action.payload.user
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats
	};
};

const setMembers: SimpleReducer<
	FlatsState,
	{ flatId: number; members: User[] }
> = (state, action) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		x => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		members: action.payload.members
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats
	};
};

const reducer: AppReducer<FlatsState, FlatsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatsActionTypes.Set:
			return setFlats(state, action);
		case FlatsActionTypes.Add:
			return addFlat(state, action);
		case FlatsActionTypes.SetOwner:
			return setOwner(state, action);
		case FlatsActionTypes.SetMembers:
			return setMembers(state, action);
		default:
			return state;
	}
};

export default reducer;
