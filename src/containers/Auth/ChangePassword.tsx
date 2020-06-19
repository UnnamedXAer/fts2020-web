import React, { useState, useRef, useEffect } from 'react';
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
	Container,
} from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import validateAuthFormField, {
	ChangePasswordFormValues,
} from '../../utils/authFormValidator';
import useForm, {
	ActionType,
	FormState,
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import { updatePassword } from '../../store/actions/auth';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

interface Props extends RouteComponentProps {}

const initialState: FormState<ChangePasswordFormValues> = {
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
	const [formState, formDispatch] = useForm<ChangePasswordFormValues>(
		initialState
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name, value } = ev.target;

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: name as keyof ChangePasswordFormValues,
			value: value,
		});
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = async (
		ev
	) => {
		const { name } = ev.target as { name: keyof ChangePasswordFormValues };
		let error = await validateAuthFormField(name, formState.values, false);

		formDispatch({
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		});

		if (name === 'password') {
			let error = await validateAuthFormField(
				'confirmPassword',
				formState.values,
				false
			);

			formDispatch({
				type: ActionType.SetError,
				fieldId: 'confirmPassword',
				error: error,
			});
		}
	};

	const submitHandler: React.FormEventHandler = async () => {
		setError(null);
		setLoading(true);
		setSuccess(false);

		for (const name in formState.values) {
			let error = await validateAuthFormField(
				name as keyof ChangePasswordFormValues,
				formState.values,
				false
			);

			formDispatch({
				type: ActionType.SetError,
				fieldId: name as keyof ChangePasswordFormValues,
				error: error,
			});
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
			isMounted.current && setSuccess(true);
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const fieldsErrors = httpError.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					formDispatch({
						type: ActionType.SetError,
						fieldId: x.param as keyof ChangePasswordFormValues,
						error: x.msg,
					})
				);

				setError(httpError.getMessage());
				setSuccess(false);
			}
		}
		isMounted.current && setLoading(false);
	};

	return (
		<Container maxWidth="xs">
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography
						variant="h5"
						component="h1"
						align="center"
						color="primary"
					>
						Change password
					</Typography>
				</Grid>
				<Grid item>
					<form noValidate onSubmit={(ev) => ev.preventDefault()}>
						<Grid container spacing={2} direction="column">
							<Grid item>
								<TextField
									size="medium"
									name="oldPassword"
									variant="outlined"
									label="Old Password"
									required
									type="password"
									fullWidth
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
									variant="outlined"
									label="New Password"
									required
									type="password"
									fullWidth
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
									label="Confirm Password"
									required
									type="password"
									fullWidth
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
								{success && (
									<CustomMuiAlert severity="success">
										Password changed successfully.
									</CustomMuiAlert>
								)}
							</Grid>
							<Grid item>
								{error && (
									<CustomMuiAlert severity="error">
										{error}
									</CustomMuiAlert>
								)}
							</Grid>
							<Grid item>
								<Box className={classes.submitWrapper}>
									{loading ? (
										<CircularProgress size={36} />
									) : (
										<>
											<Button
												style={{
													paddingLeft: 40,
													paddingRight: 40,
												}}
												onClick={() =>
													props.history.goBack()
												}
												variant="text"
												color="primary"
												type="button"
											>
												Back
											</Button>
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
										</>
									)}
								</Box>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</Container>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		fieldError: {
			color: theme.palette.error.main,
			fontSize: '0.7em',
			height: '0.8em',
			marginBlockStart: '0.2em',
		},
		submitWrapper: {
			justifyContent: 'space-around',
			alignItems: 'center',
			display: 'flex',
		},
	})
);

export default ChangePassword;
