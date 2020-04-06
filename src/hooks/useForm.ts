import { useReducer, Dispatch, Reducer } from 'react';

export enum ActionType {
	UpdateValue = 'UPDATE',
	SetError = 'SET_ERROR'
}

export type FormAction<T = any> = SetValueAction<T> | SetErrorAction<T>;

interface SetValueAction<T = any> {
	type: ActionType.UpdateValue;
	fieldId: string;
	value: T;
}

interface SetErrorAction<T = string | null> {
	type: ActionType.SetError;
	fieldId: string;
	error:T;
}

interface DefaultFormStateValues {
	[fieldId: string]: any;
}

export interface FormState<T = DefaultFormStateValues> {
	formValidity: boolean;
	values: T;
	errors: {
		[fieldId: string]: string | null;
	};
}

const formReducer = <T = DefaultFormStateValues>(
	state: FormState<T>,
	action: SetValueAction | SetErrorAction
): FormState<T> => {
	switch (action.type) {
		case ActionType.UpdateValue:
			const updatedValues = {
				...state.values,
				[action.fieldId]: action.value!
			};

			return {
				...state,
				values: updatedValues
			};

		case ActionType.SetError:
			const updatedErrors = {
				...state.errors,
				[action.fieldId]: action.error,
			};

			const updatedFormValidity = !Object.values(updatedErrors).some(
				x => x !== null
			);

			return {
				...state,
				errors: updatedErrors,
				formValidity: updatedFormValidity
			};
		default:
			return state;
	}
};

const useForm = <T, U = any>(
	initialState: FormState<T>
): [FormState<T>, Dispatch<FormAction<U>>] => {
	const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction>>(
		formReducer,
		initialState
	);

	return [state, dispatch];
};

export default useForm;
