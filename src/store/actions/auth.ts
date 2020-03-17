import { ThunkAction } from 'redux-thunk';
import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import { AUTHORIZE } from './actionTypes';
import RootState from '../storeTypes';
import User from '../../models/user';

type AuthorizeAction = {
	type: typeof AUTHORIZE;
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

			const user = new User(data.id, data.emailAddress, data.userName, data.provider, new Date(data.joinDate), data.avatarUtl, data.active);

			dispatch({
				type: AUTHORIZE,
				user
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
