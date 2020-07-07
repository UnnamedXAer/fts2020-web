import { useReducer, Reducer } from 'react';
import { StateError } from '../ReactTypes/customReactTypes';

export enum ActionType {
	UpdateValue = 'UPDATE',
	SetError = 'SET_ERROR',
	ResetForm = 'RESET_FORM',
}

export type FormAction<TField, V> =
	| SetValueAction<TField, V>
	| SetErrorAction<TField>
	| ResetFormAction;

interface SetValueAction<TField, V> {
	type: ActionType.UpdateValue;
	fieldId: TField;
	value: V;
}

interface SetErrorAction<TField, E = StateError> {
	type: ActionType.SetError;
	fieldId: TField;
	error: E;
}

interface ResetFormAction {
	type: ActionType.ResetForm;
}

export interface FormState<TValues> {
	formValidity: boolean;
	values: TValues;
	errors: {
		[fieldId in keyof TValues]: StateError;
	};
}

const formReducer = <TValues>(
	state: FormState<TValues>,
	action:
		| SetValueAction<keyof TValues, TValues[keyof TValues]>
		| SetErrorAction<keyof TValues>
		| ResetFormAction,
	initialState: FormState<TValues>
): FormState<TValues> => {
	switch (action.type) {
		case ActionType.UpdateValue:
			const updatedValues = {
				...state.values,
				[action.fieldId]: action.value!,
			};

			return {
				...state,
				values: updatedValues,
			};

		case ActionType.SetError:
			const updatedErrors = {
				...state.errors,
				[action.fieldId]: action.error,
			};

			const updatedFormValidity = !Object.values(updatedErrors).some(
				(x) => x !== null
			);

			return {
				...state,
				errors: updatedErrors,
				formValidity: updatedFormValidity,
			};
		case ActionType.ResetForm:
			return {
				...initialState,
			};
		default:
			return state;
	}
};

const useForm = <TValues>(initialState: FormState<TValues>) => {
	const [state, dispatch] = useReducer<
		Reducer<
			FormState<TValues>,
			FormAction<keyof TValues, TValues[keyof TValues]>
		>
	>(
		(
			state: FormState<TValues>,
			action:
				| SetValueAction<keyof TValues, TValues[keyof TValues]>
				| SetErrorAction<keyof TValues>
				| ResetFormAction
		) => formReducer(state, action, initialState),
		initialState
	);

	return [state, dispatch] as const;
};

export default useForm;
