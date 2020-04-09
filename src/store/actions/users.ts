import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import axios from '../../axios/axios';
import { UsersActionTypes } from './actionTypes';
import User, { Provider } from '../../models/user';

type FetchUserAction = {
	type: UsersActionTypes.FetchUser;
	payload: User;
};

export type APIUser = {
	id: number;
	emailAddress: string;
	userName: string;
	provider: Provider;
	joinDate: Date;
	avatarUrl: string | undefined;
	active: boolean;
};

export const fetchUser = (userId: number): ThunkAction<
	Promise<void>,
	RootState,
	any,
	FetchUserAction
> => {
	return async (dispatch) => {
			

		const url = `/users/${userId}`
		try {
			const { data } = await axios.post<APIUser>(url);

			const user = new User(
				data.id,
				data.emailAddress,
				data.userName,
				data.provider,
				data.joinDate,
				data.avatarUrl,
				data.active
			);

			dispatch({
				type: UsersActionTypes.FetchUser,
				payload: user
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
};
