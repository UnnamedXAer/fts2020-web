import { TaskPeriodUnit } from '../models/task';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment from 'moment';

export default function validateTaskFormField(
	fieldId: string,
	formValues: TaskFormValues, 
	currentValue?: unknown
): string | null {
	let error = null;
	switch (fieldId) {
		case 'name':
			const notAllowedUserNameValues = [
				'admin',
				'administrator',
				'moderator',
				'null',
				'undefined',
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
			error = validateTaskDate(fieldId, formValues, (currentValue ? currentValue : formValues[fieldId]) as MaterialUiPickersDate);
			break;
		default:
			break;
	}

	return error;
}

console.log("moment().startOf('day') ", moment().startOf('day'));

export const validateTaskDate = (
	fieldName: 'startDate' | 'endDate',
	formValues: TaskFormValues,
	date: MaterialUiPickersDate
): string | null => {
	let error = null;
	if (date) {
		if (date.isAfter(moment().subtract(1, 'day'))) {
			if (fieldName === 'startDate') {
				if (formValues.endDate && date.isBefore(formValues.endDate)) {
					error = 'Start Date must be lesser than End Date.';
				}
			} else {
				if (formValues.startDate && date.isBefore(formValues.startDate)) {
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
	timePeriodValue: string;
	startDate: moment.Moment;
	endDate: moment.Moment;
}