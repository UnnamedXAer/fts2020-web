import { SettingsActionTypes } from '../actions/actionTypes';
import { SettingsState, SimpleReducer, AppReducer } from '../storeTypes';
import { ShowInactiveElementsActionPayload } from '../actions/settings';

const initialState: SettingsState = {
	cookieVisible: true,
	showInactive: {
		flats: false,
		tasks: false,
		invitations: false,
	},
};

const setCookiesAlertVisibility: SimpleReducer<SettingsState, boolean> = (
	state,
	action
) => {
	return {
		...state,
		cookieVisible: action.payload,
	};
};

const setInactiveElementsVisibility: SimpleReducer<
	SettingsState,
	ShowInactiveElementsActionPayload
> = (state, action) => {
	const { visible, elements } = action.payload;

	return {
		...state,
		showInactive: {
			...state.showInactive,
			[elements]: visible,
		},
	};
};

const clearState: SimpleReducer<SettingsState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<SettingsState, SettingsActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case SettingsActionTypes.SetCookieAlertVisibility:
			return setCookiesAlertVisibility(state, action);
		case SettingsActionTypes.SetInactiveElementsVisibility:
			return setInactiveElementsVisibility(state, action);
		case SettingsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
