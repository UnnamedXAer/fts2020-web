import { SettingsActionTypes } from '../actions/actionTypes';
import { SettingsState, SimpleReducer, AppReducer } from '../storeTypes';

const initialState: SettingsState = {
	cookieVisible: true,
};

const setCookiesAlertVisible: SimpleReducer<SettingsState, boolean> = (
	state,
	action
) => {
	return {
		...state,
		cookieVisible: action.payload,
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
		case SettingsActionTypes.SetCookieAlertVisible:
			return setCookiesAlertVisible(state, action);
		case SettingsActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
