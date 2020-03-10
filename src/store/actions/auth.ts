import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import { AUTHORIZE } from './actionTypes';

export const authorize = (credentials: Credentials, isLogIn: boolean) => {
	return async (dispatch: any) => {

		const url = `/${isLogIn ? 'login' : 'register'}`;
		try {
			const { data } = await axios.post(url, credentials);

			dispatch({
				type: AUTHORIZE
			});
		}
		catch (err) {
			console.log(err);
			throw err;
		}
	};
}