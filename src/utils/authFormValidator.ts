import { StateError } from '../ReactTypes/customReactTypes';

export default async function validateAuthFormField(
	fieldId: keyof AuthFormValues | keyof ChangePasswordFormValues,
	formValues: Partial<AuthFormValues> | ChangePasswordFormValues,
	isSignIn: boolean
): Promise<StateError> {
	let error = null;
	switch (fieldId) {
		case 'userName':
			const notAllowedUserNameValues = [
				'admin',
				'administrator',
				'moderator',
				'null',
				'undefined',
				'mod',
			];
			if (
				!isSignIn &&
				(formValues as AuthFormValues)[fieldId].length < 2
			) {
				error = 'The Name must be minimum 2 characters long.';
			} else if (
				!isSignIn &&
				notAllowedUserNameValues.includes(fieldId)
			) {
				error = 'This value is not allowed as Name.';
			}
			break;
		case 'emailAddress':
			// const emailAddressRegExp = /^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
			if (!(formValues as AuthFormValues)[fieldId]) {
				error = 'Please enter Email Address.';
			} else if (
				!emailAddressRegExp.test(
					(formValues as AuthFormValues)[fieldId]
				)
			) {
				error = 'Please enter a valid Email Address.';
			}
			break;
		case 'password':
			if (!formValues[fieldId]) {
				error = 'Please enter Password.';
			} else if (
				!isSignIn &&
				!new RegExp(/^(?=\S*[a-z])(?=\S*\d)\S{6,}$/).test(
					formValues[fieldId]!
				)
			) {
				error =
					'The Password must be minimum 6 chars long, contains at least one letter and number.';
			}
			break;
		case 'confirmPassword':
			if (!isSignIn && !formValues[fieldId]) {
				error = 'Please enter Password Confirmation.';
			} else if (
				!isSignIn &&
				formValues[fieldId] !== formValues['password']
			) {
				error = 'Passwords do not match.';
			}
			break;
		case 'avatarUrl':
			//   if (
			// 		!formValues[fieldId] ||
			// 		formValues[fieldId].length >= 2083 ||
			// 		/[\s<>]/.test((formValues as AuthFormValues)[fieldId]) ||
			// 		formValues[fieldId].indexOf('mailto:') === 0
			// 	) {
			// 		error = 'Please enter correct avatar url.';
			// 	}
			if (!isSignIn && (formValues as AuthFormValues)[fieldId] !== '') {
				try {
					await testImage((formValues as AuthFormValues)[fieldId]);
				} catch (err) {
					error = 'That is not correct image url.';
				}
			}
			break;
		default:
			break;
	}

	return error;
}

// eslint-disable-next-line no-useless-escape
export const emailAddressRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function testImage(URL: string) {
	return new Promise((resolve, reject) => {
		var tester = new Image();
		tester.onload = resolve;
		tester.onerror = reject;
		tester.src = URL;
	});
}

export type AuthFormValues = {
	userName: string;
	emailAddress: string;
	password: string;
	confirmPassword: string;
	avatarUrl: string;
};

export type ChangePasswordFormValues = {
	oldPassword: string;
	password: string;
	confirmPassword: string;
};
