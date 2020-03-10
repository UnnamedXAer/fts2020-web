import { useReducer, Dispatch } from 'react';

export enum ActionType {
	UpdateValue,
	SetError
}

export interface Action {
	type: ActionType;
	fieldId: string;
	value?: string;
	isValid?: boolean;
	error?: string | null
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

const formReducer = (state: FormState, action: Action): FormState => {
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

		return {
				...state,
				errors: {...state.errors, [action.fieldId] : action.error!}
			};
		default:
			return state;
	}
};

const useForm = (initialState: FormState): [FormState, Dispatch<Action>] => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	return [state, dispatch];
};

export default useForm;
