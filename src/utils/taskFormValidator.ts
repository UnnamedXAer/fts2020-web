import { TaskPeriodUnit } from '../models/task';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment from 'moment';
import { StateError } from '../ReactTypes/customReactTypes';

export default function validateTaskFormField(
	fieldId: keyof TaskFormValues,
	formValues: TaskFormValues,
	currentValue?: unknown
): StateError {
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
			error = validateTaskDate(
				fieldId,
				formValues,
				(currentValue
					? currentValue
					: formValues[fieldId]) as MaterialUiPickersDate
			);
			break;
		default:
			break;
	}

	return error;
}

export const validateTaskDate = (
	fieldName: 'startDate' | 'endDate',
	formValues: TaskFormValues,
	date: MaterialUiPickersDate
): StateError => {
	let error = null;
	if (date) {
		if (date.isAfter(moment().subtract(1, 'day'))) {
			if (fieldName === 'startDate') {
				if (
					formValues.endDate &&
					date.isSameOrAfter(formValues.endDate, 'day')
				) {
					error = 'Start Date must be lesser than End Date.';
				}
			} else {
				if (
					formValues.startDate &&
					date.isSameOrBefore(formValues.startDate, 'day')
				) {
					error = 'End Date must be greater than Start Date.';
				}
			}
		} else {
			error = 'Date cannot be from the past.';
		}
	}
	else {
		error = 'Dates are required.'
	}
	return error;
};

export interface TaskFormValues {
	name: string;
	description: string;
	timePeriodUnit: TaskPeriodUnit;
	timePeriodValue: string;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
}
