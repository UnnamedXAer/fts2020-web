import { useReducer, Dispatch } from 'react';

export enum ActionType {
	UpdateValue,
	SetError
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

export interface FormState {
	formValidity: boolean;
	values: {
		[formId: string]: string;
	};
	errors: {
		[formId: string]: string | null;
	};
}

const formReducer = (state: FormState, action: FormAction): FormState => {
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

const useForm = (
	initialState: FormState
): [FormState, Dispatch<FormAction>] => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	return [state, dispatch];
};

export default useForm;
