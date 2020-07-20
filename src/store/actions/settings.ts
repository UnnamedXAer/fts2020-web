import { SettingsActionTypes } from './actionTypes';
import RootState, { StoreAction } from '../storeTypes';
import { ThunkAction } from 'redux-thunk';

export type ShowInactiveElementsActionPayload = {
	elements: 'flats' | 'tasks' | 'invitations';
	visible: boolean;
};

export const setCookiesAlertVisible = (
	userId: number | undefined,
	visible?: boolean
): ThunkAction<
	void,
	RootState,
	any,
	StoreAction<boolean, SettingsActionTypes.SetCookieAlertVisibility>
> => (dispatch) => {
	let _visible: boolean;
	try {
		if (visible === void 0) {
			_visible =
				localStorage.getItem(
					'cookies_alert_visibility_' +
						(typeof userId === 'number' ? '' + userId : 'all')
				) !== '0';
		} else {
			_visible = visible;
			localStorage.setItem(
				'cookies_alert_visibility_' +
					(typeof userId === 'number' ? '' + userId : 'all'),
				_visible ? '1' : '0'
			);
		}
		dispatch({
			type: SettingsActionTypes.SetCookieAlertVisibility,
			payload: _visible,
		});
	} catch (err) {}
};

export const setCookiesInactiveElementsVisibility = (
	elements: 'flats' | 'tasks' | 'invitations',
	userId: number | undefined,
	visible?: boolean
): ThunkAction<
	void,
	RootState,
	any,
	StoreAction<
		ShowInactiveElementsActionPayload,
		SettingsActionTypes.SetInactiveElementsVisibility
	>
> => (dispatch, getState) => {
	const _userId = userId || getState().auth.user!.id;
	let _visible: boolean;
	try {
		if (visible === void 0) {
			_visible =
				localStorage.getItem(
					`inactive_${elements}_visibility_${_userId}`
				) === '1';
		} else {
			_visible = visible;
			localStorage.setItem(
				`inactive_${elements}_visibility_${_userId}`,
				_visible ? '1' : '0'
			);
		}
		dispatch({
			type: SettingsActionTypes.SetInactiveElementsVisibility,
			payload: {
				visible: _visible,
				elements,
			},
		});
	} catch (err) {}
};
