import { AppReducer, FlatsState, SimpleReducer } from '../storeTypes';
import { FlatsActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';

const initialState: FlatsState = {
	flats: []
};

const setFlats: SimpleReducer<FlatsState, Flat[]> = (
	state,
	action
) => {
	return {
		...state,
		flats: action.payload
	};
};

const addFlat: SimpleReducer<FlatsState, Flat> = (
	state,
	action
) => {
	return {
		...state,
		flats: state.flats.concat(action.payload)
	};
};
console.log(Object.values(FlatsActionTypes));

const reducer: AppReducer<FlatsState, FlatsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatsActionTypes.Set:
			return setFlats(state, action);
		case FlatsActionTypes.Add:
			return addFlat(state, action);
		default:
			return state;
	}
};

export default reducer;
