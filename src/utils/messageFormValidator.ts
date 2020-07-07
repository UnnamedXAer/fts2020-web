import { StateError } from '../ReactTypes/customReactTypes';

export default function validateUserMessageField(
	fieldId: keyof MessageFormFields,
	formValues: MessageFormFields
): StateError {
	let error = null;
	switch (fieldId) {
		case 'title':
			const notAllowedUserNameValues = [
				'admin',
				'administrator',
				'moderator',
				'null',
				'undefined',
			];
			if (formValues[fieldId].length === 0) {
				error = 'The Title is required';
			} else if (formValues[fieldId].length > 50) {
				error = 'The Title can be max 50 characters long.';
			} else if (notAllowedUserNameValues.includes(fieldId)) {
				error = 'This value is not allowed as Title.';
			}
			break;
		case 'message':
			if (formValues[fieldId].length === 0) {
				error = 'The Message is required';
			}
			if (formValues[fieldId].length > 500) {
				error = 'The Message can be max 500 characters long.';
			}
			break;
		default:
			break;
	}

	return error;
}

export interface MessageFormFields {
	message: string;
	title: string;
}
