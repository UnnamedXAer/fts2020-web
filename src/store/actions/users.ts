import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import axios from '../../axios/axios';
import { UsersActionTypes, AuthActionTypes } from './actionTypes';
import User, { Provider } from '../../models/user';
import { AxiosResponse } from 'axios';
import { updateLoggedUser } from './auth';

export type FetchUserAction = {
	type: UsersActionTypes.SetUser;
	payload: User;
};

export type APIUser = {
	id: number;
	emailAddress: string;
	userName: string;
	provider: Provider;
	joinDate: string;
	avatarUrl: string | undefined;
	active: boolean;
};

export const fetchUser = (
	userId: number
): ThunkAction<Promise<void>, RootState, any, FetchUserAction> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data, status } = await axios.get<APIUser>(url);
			if (status === 200) {
				const user = mapApiUserDataToModel(data);

				dispatch({
					type: UsersActionTypes.SetUser,
					payload: user,
				});
			} else {
				throw new Error('User not found!');
			}
		} catch (err) {
			throw err;
		}
	};
};

export const updateUser = (
	userId: number,
	user: Partial<User>
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	FetchUserAction | { type: AuthActionTypes.SetLoggedUser; payload: User }
> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.patch<
				Partial<User>,
				AxiosResponse<APIUser>
			>(url, user);

			const updatedUser = mapApiUserDataToModel(data);

			dispatch({
				type: UsersActionTypes.SetUser,
				payload: updatedUser,
			});
			dispatch(updateLoggedUser(updatedUser));
		} catch (err) {
			throw err;
		}
	};
};

export const mapApiUserDataToModel = (data: APIUser): User =>
	new User(
		data.id,
		data.emailAddress,
		data.userName,
		data.provider,
		typeof data.joinDate === 'string'
			? new Date(data.joinDate)
			: data.joinDate,
		data.avatarUrl,
		data.active
	);
