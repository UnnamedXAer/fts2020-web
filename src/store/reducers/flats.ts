import { AppReducer, FlatsState, SimpleReducer } from '../storeTypes';
import { FlatsActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';
import User from '../../models/user';
import {
	AddFlatActionPayload,
	SetFlatInvitationsActionPayload,
	UpdateInvitationActionPayload,
} from '../actions/flats';

const initialState: FlatsState = {
	flats: [],
	flatsLoadTime: 0,
	createdFlatsTmpIds: {},
};

const setFlats: SimpleReducer<FlatsState, Flat[]> = (state, action) => {
	const updatedFlats: Flat[] = action.payload.map((flat) => {
		const oldFlat = state.flats.find((x) => x.id === flat.id);
		if (!oldFlat) {
			return flat;
		} else {
			const newFlat = new Flat(flat);
			if (oldFlat.members) {
				newFlat.members = oldFlat.members;
			}
			if (oldFlat.invitations) {
				newFlat.invitations = oldFlat.invitations;
			}
			if (oldFlat.owner) {
				newFlat.owner = oldFlat.owner;
			}
			return newFlat;
		}
	});

	return {
		...state,
		flats: updatedFlats,
		flatsLoadTime: Date.now(),
	};
};

const setFlat: SimpleReducer<FlatsState, Flat> = (state, action) => {
	const flat = action.payload;
	const updatedFlats = [...state.flats];
	const flatIdx = updatedFlats.findIndex((x) => x.id === flat.id);

	if (flatIdx === -1) {
		updatedFlats.push(flat);
	} else {
		const updatedFlat = flat;

		if (updatedFlats[flatIdx].owner) {
			updatedFlat.owner = updatedFlats[flatIdx].owner;
		}
		if (updatedFlats[flatIdx].members) {
			updatedFlat.members = updatedFlats[flatIdx].members;
		}
		updatedFlats[flatIdx] = updatedFlat;
	}

	return {
		...state,
		flats: updatedFlats,
	};
};

const addFlat: SimpleReducer<FlatsState, AddFlatActionPayload> = (
	state,
	action
) => {
	const { flat, tmpId } = action.payload;

	return {
		...state,
		flats: state.flats.concat(flat),
		createdFlatsTmpIds: { ...state.createdFlatsTmpIds, [tmpId]: flat.id },
	};
};

const setOwner: SimpleReducer<FlatsState, { user: User; flatId: number }> = (
	state,
	action
) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		owner: action.payload.user,
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const setMembers: SimpleReducer<
	FlatsState,
	{ flatId: number; members: User[] }
> = (state, action) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = {
		...updatedFlats[flatIndex],
		members: action.payload.members,
	};
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const setInvitations: SimpleReducer<
	FlatsState,
	SetFlatInvitationsActionPayload
> = (state, action) => {
	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex(
		(x) => x.id === action.payload.flatId
	);
	const updatedFlat = new Flat({
		...updatedFlats[flatIndex],
		invitations: action.payload.invitations,
	});
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const updateInvitation: SimpleReducer<
	FlatsState,
	UpdateInvitationActionPayload
> = (state, action) => {
	const { flatId, invitation } = action.payload;

	const updatedFlats = [...state.flats];
	const flatIndex = updatedFlats.findIndex((x) => x.id === flatId);

	const updatedInvitations = updatedFlats[flatIndex].invitations
		? [...updatedFlats[flatIndex].invitations!]
		: void 0;
	if (updatedInvitations) {
		const invIdx = updatedInvitations.findIndex(
			(x) => x.id === invitation.id
		);
		if (invIdx !== -1) {
			updatedInvitations[invIdx] = invitation;
		} else {
			updatedInvitations.push(invitation);
		}
	}
	const updatedFlat = new Flat({
		...updatedFlats[flatIndex],
		invitations: updatedInvitations,
	});
	updatedFlats[flatIndex] = updatedFlat;

	return {
		...state,
		flats: updatedFlats,
	};
};

const clearState: SimpleReducer<FlatsState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<FlatsState, FlatsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatsActionTypes.Set:
			return setFlats(state, action);
		case FlatsActionTypes.SetFlat:
			return setFlat(state, action);
		case FlatsActionTypes.Add:
			return addFlat(state, action);
		case FlatsActionTypes.SetOwner:
			return setOwner(state, action);
		case FlatsActionTypes.SetMembers:
			return setMembers(state, action);
		case FlatsActionTypes.SetInvitations:
			return setInvitations(state, action);
		case FlatsActionTypes.SetInvitation:
			return updateInvitation(state, action);
		case FlatsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
