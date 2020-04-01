import { useReducer, Dispatch, Reducer } from 'react';

export enum ActionType {
	UpdateValue = 'UPDATE',
	SetError = 'SET_ERROR'
}

export type FormAction = SetValueAction | SetErrorAction;

interface SetValueAction {
	type: ActionType.UpdateValue;
	fieldId: string;
	value: string;
}

interface SetErrorAction {
	type: ActionType.SetError;
	fieldId: string;
	error: string | null;
}

interface DefaultFormStateValues {
	[formId: string]: string;
}

export interface FormState<T = DefaultFormStateValues> {
	formValidity: boolean;
	values: T;
	errors: {
		[formId: string]: string | null;
	};
}

const formReducer = <T = DefaultFormStateValues>(
	state: FormState<T>,
	action: FormAction
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
				[action.fieldId]: action.error
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

const useForm = <T = DefaultFormStateValues>(
	initialState: FormState<T>
): [FormState<T>, Dispatch<FormAction>] => {
	const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction>>(
		formReducer,
		initialState
	);

	return [state, dispatch];
};

export default useForm;
