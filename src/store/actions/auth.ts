import { ThunkAction } from 'redux-thunk';
import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import {
	AUTHORIZE,
	LOGOUT,
	TasksActionTypes,
	FlatsActionTypes,
	AuthActionTypes,
	UsersActionTypes,
	InvitationsActionTypes,
	TaskPeriodsActionTypes,
} from './actionTypes';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';
import { mapApiUserDataToModel, FetchUserAction, APIUser } from './users';

type AuthorizeActionPayload = {
	user: User;
	expirationTime: number;
};

type AuthorizeAction = {
	type: string;
	payload?: AuthorizeActionPayload;
};

export const authorize = (
	credentials: Credentials,
	isLogIn: boolean
): ThunkAction<Promise<void>, RootState, any, AuthorizeAction | FetchUserAction> => {
	return async (dispatch, _getState) => {
		const url = `/auth/${isLogIn ? 'login' : 'register'}`;
		try {
			const { data } = await axios.post(url, credentials);
			const user = mapApiUserDataToModel(data.user);
			const expirationTime = Date.now() + data.expiresIn;

			dispatch({
				type: AUTHORIZE,
				payload: {
					user,
					expirationTime,
				},
			});
			dispatch({
				type: UsersActionTypes.SetUser,
				payload: user,
			});

			setTimeout(() => {
				dispatch(logOut());
			}, data.expiresIn);

			localStorage.setItem('loggedUser', JSON.stringify(user));
			localStorage.setItem('expirationTime', '' + expirationTime);
		} catch (err) {
			throw err;
		}
	};
};

export const fetchLoggedUser = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction | FetchUserAction
> => {
	return async (dispatch) => {
		const url = `/auth/logged-user`;
		try {
			const { data } = await axios.get<{ user: APIUser; expiresIn: number }>(url);
			const user = mapApiUserDataToModel(data.user);
			const expirationTime = Date.now() + data.expiresIn;

			dispatch({
				type: AUTHORIZE,
				payload: {
					user,
					expirationTime,
				},
			});
			dispatch({
				type: UsersActionTypes.SetUser,
				payload: user,
			});

			setTimeout(() => {
				dispatch(logOut());
			}, data.expiresIn);

			localStorage.setItem('loggedUser', JSON.stringify(user));
			localStorage.setItem('expirationTime', '' + expirationTime);
		} catch (err) {
			throw err;
		}
	};
};

export const tryAuthorize = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction | FetchUserAction
> => {
	return async (dispatch) => {
		const savedUser = localStorage.getItem('loggedUser');
		const savedExpirationTime = localStorage.getItem('expirationTime');
		const expirationTime = savedExpirationTime ? +savedExpirationTime : 0;

		const expiresIn = expirationTime - Date.now();
		if (savedUser && expirationTime && expiresIn > 1000 * 60 * 30) {
			const userObj = JSON.parse(savedUser) as User;

			dispatch({
				type: AUTHORIZE,
				payload: {
					user: userObj,
					expirationTime,
				},
			});

			dispatch({
				type: UsersActionTypes.SetUser,
				payload: userObj,
			});

			setTimeout(() => {
				dispatch(logOut());
			}, expiresIn);
		} else {
			throw new Error('Auto-authorization was not possible.');
		}
	};
};

export const logOut = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	{ type: typeof LOGOUT }
> => {
	return async (dispatch) => {
		dispatch({
			type: LOGOUT,
		});
		localStorage.removeItem('loggedUser');
		localStorage.removeItem('expirationTime');
		try {
			await axios.post('/auth/logout');
		} catch (err) {}
		dispatch(clearStore());
	};
};

export const updateLoggedUser = (
	user: User
): StoreAction<User, AuthActionTypes.SetLoggedUser> => {
	localStorage.setItem('loggedUser', JSON.stringify(user));
	return {
		type: AuthActionTypes.SetLoggedUser,
		payload: user,
	};
};

export const updatePassword = (
	oldPassword: string,
	newPassword: string,
	confirmPassword: string
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	{ type: AuthActionTypes.UpdatePassword }
> => {
	return async (dispatch) => {
		const url = `/auth/change-password`;
		try {
			await axios.post(url, {
				oldPassword,
				newPassword,
				confirmPassword,
			});

			dispatch({
				type: AuthActionTypes.UpdatePassword,
				payload: void 0,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const clearStore = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction
> => {
	return async (dispatch) => {
		[
			TasksActionTypes,
			FlatsActionTypes,
			InvitationsActionTypes,
			TaskPeriodsActionTypes,
			UsersActionTypes,
		].forEach((ActionTypes) => {
			dispatch({
				type: ActionTypes.ClearState,
			});
		});
	};
};
