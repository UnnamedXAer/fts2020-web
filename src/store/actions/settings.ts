import { SettingsActionTypes } from './actionTypes';
import RootState, { StoreAction } from '../storeTypes';
import { ThunkAction } from 'redux-thunk';

export const setCookiesAlertVisible = (
	visible?: boolean
): ThunkAction<
	void,
	RootState,
	any,
	StoreAction<boolean, SettingsActionTypes.SetCookieAlertVisible>
> => (dispatch, getState) => {
	const id = getState().auth.user?.id;
	let _visible: boolean;
	try {
		if (visible === void 0) {
			_visible =
				localStorage.getItem(
					'cookies_alert_visibility_' + typeof id === 'number'
						? '' + id
						: 'all'
				) === '1';
		} else {
			_visible = visible;
			localStorage.setItem(
				'cookies_alert_visibility_' + typeof id === 'number'
					? '' + id
					: 'all',
				_visible ? '1' : '0'
			);
		}
		dispatch({
			type: SettingsActionTypes.SetCookieAlertVisible,
			payload: _visible,
		});
	} catch (err) {}
};
