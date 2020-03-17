export default function validateFlatFormField(
	fieldId: string,
	formValues: { [key: string]: string }
): string | null {
	let error = null;
	switch (fieldId) {
		case 'name':
			const notAllowedUserNameValues = [
				'admin',
				'administrator',
				'moderator',
				'null',
				'undefined'
			];
			if (formValues[fieldId].length < 2) {
				error = 'The Name must be minimum 2 characters long.';
			} else if (notAllowedUserNameValues.includes(fieldId)) {
				error = 'This value is not allowed as Name.';
			}
			break;
		case 'description':
			if (formValues[fieldId].length > 500) {
				error = 'The Description can be max 500 characters long.';
			}
			break;
		default:
			break;
	}

	return error;
}
