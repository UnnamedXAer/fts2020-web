import { TaskPeriodUnit } from '../models/task';

export default function validateTaskFormField(
	fieldId: string,
	formValues: TaskFormValues
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
		case 'startDate':
		case 'endDate':
			break;
		default:
			break;
	}

	return error;
}

export const validateTaskDate = (
	fieldName: 'startDate' | 'endDate',
	formValues: TaskFormValues,
	date: Date
): string | null => {
	let error = null;
	if (date) {
		if (date > new Date()) {
			if (fieldName === 'startDate') {
				if (formValues.endDate && date >= formValues.endDate) {
					error = 'Start Date must be lesser than End Date.';
				}
			} else {
				if (formValues.startDate && date <= formValues.startDate) {
					error = 'End Date must be greater than Start Date.';
				}
			}
		} else {
			error = 'Date cannot be from the past.';
		}
	}
	return error;
};

export interface TaskFormValues {
	name: string;
	description: string;
	timePeriodUnit: TaskPeriodUnit;
	timePeriodValue: number;
	startDate: Date;
	endDate: Date;
}
