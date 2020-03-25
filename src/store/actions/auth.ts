import { ThunkAction } from 'redux-thunk';
import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import { AUTHORIZE, LOGOUT } from './actionTypes';
import RootState from '../storeTypes';
import User from '../../models/user';

type AuthorizeAction = {
	type: string;
};

export const authorize = (
	credentials: Credentials,
	isLogIn: boolean
): ThunkAction<Promise<void>, RootState, any, AuthorizeAction> => {
	return async (dispatch, _getState) => {
		const url = `/auth/${isLogIn ? 'login' : 'register'}`;
		try {
			const { data } = await axios.post(url, credentials);
			console.log('auth data: ', data);

			const user = new User(
				data.user.id,
				data.user.emailAddress,
				data.user.userName,
				data.user.provider,
				new Date(data.user.joinDate),
				data.user.avatarUtl,
				data.user.active
			);

			const expirationTime = Date.now() + data.expiresIn;

			dispatch({
				type: AUTHORIZE,
				payload: {
					user,
					expirationTime
				}
			});

			setTimeout(() => {
				dispatch(logOut());
			}, data.expiresIn);

			localStorage.setItem('loggedUser', JSON.stringify(user));
			localStorage.setItem('expirationTime', '' + expirationTime);
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};

export const tryAuthorize = (): ThunkAction<
	void,
	RootState,
	any,
	AuthorizeAction
> => {
	return (dispatch, getState) => {
		const savedUser = localStorage.getItem('loggedUser');
		const expirationTime = localStorage.getItem('expirationTime');
		if (
			savedUser &&
			expirationTime &&
			new Date(+expirationTime).getTime() > Date.now()
		) {
			dispatch({
				type: AUTHORIZE,
				payload: {
					user: JSON.parse(savedUser),
					expirationTime: +expirationTime
				}
			});
		} else {
			throw new Error('Auto-authorization was not possible.');
		}
	};
};

export const logOut = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction
> => {
	return async dispatch => {
		try {
			await axios.post('/auth/logout');
			setTimeout(() => {
				dispatch({
					type: LOGOUT
				});
			}, 0);
		} catch (err) {
			if (localStorage.getItem('loggedUser')) {
				setTimeout(() => {
					dispatch(logOut());
				}, 500);
			} else {
				dispatch({
					type: LOGOUT
				});
			}
		}
		localStorage.removeItem('loggedUser');
		localStorage.removeItem('expirationTime');
	};
};
