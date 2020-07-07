import React, { useState, useEffect, useRef } from 'react';
import {
	TextField,
	makeStyles,
	Theme,
	FormHelperText,
	Grid,
} from '@material-ui/core';
import AlertDialog from '../UI/AlertDialog';
import { StateError } from '../../ReactTypes/customReactTypes';
import useForm, {
	FormState,
	ActionType,
	FormAction,
} from '../../hooks/useForm';
import validateUserMessageField, {
	MessageFormFields,
} from '../../utils/messageFormValidator';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import User from '../../models/user';
import HttpErrorParser from '../../utils/parseError';
import axios from '../../axios/axios';

interface Props {
	open: boolean;
	user: User | null;
	onClose: () => void;
	onMessageSent: (success: boolean) => void;
}

const SendMessageDialog: React.FC<Props> = (props) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	const initialFormValues: FormState<MessageFormFields> = {
		formValidity: false,
		values: { title: '', message: '' },
		errors: {
			message: null,
			title: null,
		},
	};
	const [formState, formDispatch] = useForm(initialFormValues);
	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		return () => {
			setTimeout(() => {
				if (isMounted.current) {
					formDispatch({ type: ActionType.ResetForm });
					setLoading(false);
					setError(null);
				}
			}, 0);
		};
	}, [formDispatch, props.user, props.open]);

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name, value } = ev.target as {
			name: keyof MessageFormFields;
			value: string;
		};

		const cutValue = value.substr(0, name === 'title' ? 50 : 500);

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: name,
			value: cutValue,
		});
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name } = ev.target as { name: keyof MessageFormFields };
		let error = validateUserMessageField(name, formState.values);

		formDispatch({
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		});
	};

	const sendMessageHandler = async () => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = validateUserMessageField(
				name as keyof MessageFormFields,
				formState.values
			);

			const action: FormAction<keyof MessageFormFields, StateError> = {
				type: ActionType.SetError,
				fieldId: name as keyof MessageFormFields,
				error: error,
			};

			formDispatch(action);
		}

		if (!formState.formValidity) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		const payload = {
			type: 'user',
			userId: props.user!.id,
			title: formState.values.title.trim(),
			message: formState.values.message.trim(),
		};

		try {
			await axios.post(`/messages`, payload);
			props.onMessageSent(true);
		} catch (err) {
			props.onMessageSent(false);
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				const fieldsErrors = httpError.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					formDispatch({
						type: ActionType.SetError,
						fieldId: x.param as keyof MessageFormFields,
						error: x.msg,
					})
				);
				setError(msg);
				setLoading(false);
			}
		}
	};

	return (
		<AlertDialog
			data={{
				loading,
				onClose: props.onClose,
				open: props.open,
				title: `Message to ${props.user?.emailAddress}`,
				actions: [
					{
						label: 'Send',
						onClick: sendMessageHandler,
						color: 'primary',
					},
					{
						color: 'secondary',
						label: 'Cancel',
						onClick: props.onClose,
					},
				],
				content: (
					<Grid
						container
						direction="column"
						spacing={1}
						style={{ width: 540 }}
					>
						<Grid item>
							<TextField
								size="small"
								name="title"
								fullWidth
								variant="outlined"
								label="Subject"
								type="text"
								disabled={loading}
								value={formState.values.title}
								error={!!formState.errors.title}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
							<FormHelperText
								className={classes.fieldError}
								error={!!formState.errors.title}
							>
								{formState.errors.title ||
									formState.values.title.length +
										'/50 characters'}
							</FormHelperText>
						</Grid>
						<Grid item>
							<TextField
								size="small"
								name="message"
								placeholder="Say hello!"
								fullWidth
								variant="outlined"
								label="Message text"
								type="text"
								disabled={loading}
								multiline
								rows={5}
								rowsMax={8}
								value={formState.values.message}
								error={!!formState.errors.message}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
							<FormHelperText
								className={classes.fieldError}
								error={!!formState.errors.message}
							>
								{formState.errors.title ||
									formState.values.message.length +
										'/500 characters'}
							</FormHelperText>
						</Grid>
						<Grid item>
							{error && (
								<CustomMuiAlert severity="error">
									{error}
								</CustomMuiAlert>
							)}
						</Grid>
					</Grid>
				),
			}}
		/>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	fieldError: {
		// color: theme.palette.error.main,
		// fontSize: '0.7em',
		// height: '0.8em',
		// marginBlockStart: '0.2em',
		// width: '100%',
	},
}));

export default SendMessageDialog;
