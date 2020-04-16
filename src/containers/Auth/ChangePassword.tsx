import React, { useState } from 'react';
import {
	Grid,
	Typography,
	makeStyles,
	Theme,
	createStyles,
	TextField,
	Button,
	CircularProgress,
	Box,
} from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ErrorOutline } from '@material-ui/icons';
import validateAuthFormField from '../../utils/authFormValidator';
import useForm, {
	ActionType,
	FormAction,
	FormState,
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import { updatePassword } from '../../store/actions/auth';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const initialState: FormState = {
	formValidity: false,
	values: {
		oldPassword: '',
		password: '',
		confirmPassword: '',
	},
	errors: {
		oldPassword: null,
		password: null,
		confirmPassword: null,
	},
};

const ChangePassword: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [formState, formDispatch] = useForm(initialState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name, value } = ev.target;

		const action: FormAction = {
			type: ActionType.UpdateValue,
			fieldId: name,
			value: value,
		};

		formDispatch(action);
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = async (
		ev
	) => {
		const { name } = ev.target;
		let error = await validateAuthFormField(name, formState.values, false);

		const action: FormAction = {
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		};

		formDispatch(action);

		if (name === 'password') {
			let error = await validateAuthFormField(
				'confirmPassword',
				formState.values,
				false
			);
			const action: FormAction = {
				type: ActionType.SetError,
				fieldId: 'confirmPassword',
				error: error,
			};

			formDispatch(action);
		}
	};

	const submitHandler: React.FormEventHandler = async () => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = await validateAuthFormField(
				name,
				formState.values,
				false
			);

			const action: FormAction = {
				type: ActionType.SetError,
				fieldId: name,
				error: error,
			};

			formDispatch(action);
		}

		if (!formState.formValidity) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		try {
			await dispatch(
				updatePassword(
					formState.values.oldPassword,
					formState.values.password,
					formState.values.confirmPassword
				)
			);
		} catch (err) {
			const errorData = new HttpErrorParser(err);
			const fieldsErrors = errorData.getFieldsErrors();
			fieldsErrors.forEach((x) =>
				formDispatch({
					type: ActionType.SetError,
					fieldId: x.param,
					error: x.msg,
				})
			);

			setError(errorData.getMessage());
			setLoading(false);
		}
	};

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography
					variant="h3"
					component="h1"
					align="center"
					color="primary"
				>
					Sign Up
				</Typography>
			</Grid>
			<Grid item>
				<form noValidate onSubmit={(ev) => ev.preventDefault()}>
					<Grid
						container
						spacing={2}
						direction="column"
						alignItems="center"
					>
						<Grid item>
							<TextField
								size="medium"
								name="oldPassword"
								fullWidth
								variant="outlined"
								label="Old Password"
								required
								type="password"
								value={formState.values.oldPassword}
								error={!!formState.errors.oldPassword}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
							{formState.errors.password && (
								<p className={classes.fieldError}>
									{formState.errors.oldPassword}
								</p>
							)}
						</Grid>
						<Grid item>
							<TextField
								size="medium"
								name="password"
								fullWidth
								variant="outlined"
								label="New Password"
								required
								type="password"
								value={formState.values.password}
								error={!!formState.errors.password}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
							{formState.errors.password && (
								<p className={classes.fieldError}>
									{formState.errors.password}
								</p>
							)}
						</Grid>
						<Grid item>
							<TextField
								size="medium"
								name="confirmPassword"
								variant="outlined"
								fullWidth
								label="Confirm Password"
								required
								type="password"
								value={formState.values.confirmPassword}
								error={!!formState.errors.confirmPassword}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
							{formState.errors.confirmPassword && (
								<p className={classes.fieldError}>
									{formState.errors.confirmPassword}
								</p>
							)}
						</Grid>

						<Grid item>
							{error && (
								<Box
									display="flex"
									flexDirection="row"
									alignItems="center"
								>
									<ErrorOutline
										style={{ marginInlineEnd: 20 }}
										color="error"
									/>
									<p className={classes.formErrorText}>
										{error}
									</p>
								</Box>
							)}
						</Grid>
						<Grid item>
							<Box className={classes.submitWrapper}>
								{loading ? (
									<CircularProgress size={36} />
								) : (
									<Button
										style={{
											paddingLeft: 40,
											paddingRight: 40,
										}}
										onClick={submitHandler}
										variant="contained"
										color="primary"
										type="submit"
									>
										Save
									</Button>
								)}
							</Box>
						</Grid>
					</Grid>
				</form>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100vh',
			display: 'flex',
			justifyContent: 'stretch',
			alignItems: 'center',
		},
		header: {
			paddingBottom: theme.spacing(2),
		},
		fieldError: {
			color: theme.palette.error.main,
			fontSize: '0.7em',
			height: '0.8em',
			marginBlockStart: '0.2em',
		},
		submitWrapper: {
			justifyContent: 'center',
			alignItems: 'center',
			display: 'flex',
		},
		formErrorText: {
			color: theme.palette.error.main,
			fontWeight: 'bold',
		},
	})
);

export default ChangePassword;
