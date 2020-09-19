import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	Typography,
	TextField,
	Grid,
	Avatar,
	Paper,
	Box,
	makeStyles,
	Button,
	Container,
	Theme,
	Link,
	IconButton,
	Slide,
	CircularProgress,
	Modal,
	Fade,
	Backdrop,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import useForm, { FormState, ActionType } from '../../../hooks/useForm';
import validateAuthFormField, { AuthFormValues } from '../../../utils/authFormValidator';
import { authorize, fetchLoggedUser, tryAuthorize } from '../../../store/actions/auth';
import { Credentials } from '../../../models/auth';
import HttpErrorParser from '../../../utils/parseError';
import CustomMuiAlert from '../../../components/UI/CustomMuiAlert';
import RootState from '../../../store/storeTypes';
import { RouteComponentProps } from 'react-router-dom';

const initialState: FormState<AuthFormValues> = {
	formValidity: false,
	values: {
		userName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
		avatarUrl: '',
	},
	errors: {
		userName: null,
		emailAddress: null,
		password: null,
		confirmPassword: null,
		avatarUrl: null,
	},
};

type TextFieldSize = 'small' | 'medium';

const getFieldSize = (isLogIn: boolean): TextFieldSize =>
	!isLogIn && window.innerHeight < 700 ? 'small' : 'medium';

interface Props extends RouteComponentProps {}

const SignIn = (props: Props) => {
	const classes = useStyle();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state: RootState) => state.auth.user);
	const [formState, formDispatch] = useForm<AuthFormValues>(initialState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSignIn, setIsSignIn] = useState(true);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [textFieldSize, setTextFieldSize] = useState<TextFieldSize>(
		getFieldSize(isSignIn)
	);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (props.location.hash === '#success') {
			setLoading(true);
			(async () => {
				console.log('#success');
				try {
					await dispatch(fetchLoggedUser());
					props.history.replace('/');
				} catch (err) {
					console.log('err', err);
					props.history.replace('/auth');
				}
			})();
		}
	}, [dispatch, props.history, props.location]);

	useEffect(() => {
		if (!loggedUser) {
			(async () => {
				try {
					await dispatch(tryAuthorize());
				} catch (err) {}
			})();
		}
	}, [dispatch, loggedUser]);

	const updateTextFieldSize = useCallback(() => {
		setTextFieldSize(getFieldSize(isSignIn));
	}, [isSignIn]);

	useEffect(updateTextFieldSize, [updateTextFieldSize]);

	useEffect(() => {
		const resizeHandler = updateTextFieldSize;
		window.addEventListener('resize', resizeHandler);
		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}, [updateTextFieldSize]);

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		const { name, value } = ev.target;

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: name as keyof AuthFormValues,
			value: value,
		});
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = async (ev) => {
		const name = ev.target.name as keyof AuthFormValues;
		let error = await validateAuthFormField(name, formState.values, isSignIn);

		formDispatch({
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		});

		if (name === 'password') {
			let error = await validateAuthFormField(
				'confirmPassword',
				formState.values,
				isSignIn
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

		let isFormValid = true;
		for (const name in formState.values) {
			let error = await validateAuthFormField(
				name as keyof AuthFormValues,
				formState.values,
				isSignIn
			);
			isFormValid = isFormValid && error === null;

			formDispatch({
				type: ActionType.SetError,
				fieldId: name as keyof AuthFormValues,
				error: error,
			});
		}

		if (!isFormValid) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		const credentials = new Credentials({
			userName: isSignIn ? void 0 : formState.values.userName,
			emailAddress: formState.values.emailAddress,
			password: formState.values.password,
			confirmPassword: isSignIn ? void 0 : formState.values.confirmPassword,
			avatarUrl: isSignIn ? void 0 : formState.values.avatarUrl,
		});
		try {
			await dispatch(authorize(credentials, isSignIn));
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const fieldsErrors = httpError.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					formDispatch({
						type: ActionType.SetError,
						fieldId: x.param as keyof AuthFormValues,
						error: x.msg,
					})
				);
				const msg = isSignIn ? 'Invalid credentials.' : httpError.getMessage();
				setError(msg);
				setLoading(false);
			}
		}
	};

	return (
		<>
			<Container maxWidth="sm" className={classes.container}>
				<Paper className={classes.paper} elevation={5}>
					<Box className={classes.header}>
						<Typography variant="h3" align="center" color="primary">
							{isSignIn ? 'Sign In' : 'Sign Up'}
						</Typography>
					</Box>
					<form noValidate onSubmit={(ev) => ev.preventDefault()}>
						<Grid
							container
							direction="column"
							alignItems="stretch"
							justify="center"
							spacing={2}
						>
							<Box
								justifyContent="center"
								alignItems="center"
								display="flex"
								flexDirection="column"
							>
								<Box
									className={classes.avatarBox}
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Avatar
										alt="user avatar"
										src={
											isSignIn || formState.errors.avatarUrl
												? ''
												: formState.values.avatarUrl
										}
										className={classes.avatar}
									/>
									{!isSignIn && (
										<IconButton
											className={classes.avatarCamera}
											color="primary"
											aria-label="upload picture"
											component="span"
											onClick={() => setOpenEditModal(true)}
										>
											<EditRoundedIcon />
										</IconButton>
									)}
								</Box>
								{!isSignIn && formState.errors.avatarUrl && (
									<p className={classes.fieldError}>
										Avatar Url is not correct.
									</p>
								)}
							</Box>
							<Slide
								direction="left"
								in={!isSignIn}
								mountOnEnter
								unmountOnExit
							>
								<Grid item>
									<TextField
										size={textFieldSize}
										name="userName"
										fullWidth
										variant="outlined"
										label="Name"
										required
										value={formState.values.userName}
										error={!!formState.errors.userName}
										onChange={fieldChangeHandler}
										onBlur={fieldBlurHandler}
									/>
									{formState.errors.userName && (
										<p className={classes.fieldError}>
											{formState.errors.userName}
										</p>
									)}
								</Grid>
							</Slide>
							<Grid item>
								<TextField
									size={textFieldSize}
									name="emailAddress"
									fullWidth
									variant="outlined"
									label="Email Address"
									type="email"
									required
									value={formState.values.emailAddress}
									error={!!formState.errors.emailAddress}
									onChange={fieldChangeHandler}
									onBlur={fieldBlurHandler}
								/>
								{formState.errors.emailAddress && (
									<p className={classes.fieldError}>
										{formState.errors.emailAddress}
									</p>
								)}
							</Grid>
							<Grid item>
								<TextField
									size={textFieldSize}
									name="password"
									fullWidth
									variant="outlined"
									label="Password"
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
							<Slide
								direction="left"
								in={!isSignIn}
								mountOnEnter
								unmountOnExit
							>
								<Grid item>
									<TextField
										size={textFieldSize}
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
							</Slide>
							<Grid item>
								<Link
									onClick={() => {
										setError(null);
										setIsSignIn((prevState) => !prevState);
									}}
									variant="body2"
									style={{ cursor: 'pointer' }}
								>
									{`Switch to ${isSignIn ? 'Sign Up' : 'Sign In'}`}
								</Link>
							</Grid>
							<Grid item>
								{error && (
									<CustomMuiAlert
										severity="error"
										onClick={() => setError(null)}
									>
										{error}
									</CustomMuiAlert>
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
											{isSignIn ? 'Sign In' : 'Sign Up'}
										</Button>
									)}
								</Box>
							</Grid>
						</Grid>
					</form>
					<Grid item container justify="center">
						<Button
							color="secondary"
							onClick={(ev) => {
								ev.preventDefault();
								window.open(
									'http://localhost:3020/auth/github/login',
									'_self'
								);
								// window.location.href =
								// 	'http://192.168.1.9:3020/auth/github';
								// const win = window.open(
								// 	'http://192.168.1.9:3020/auth/github',
								// 	'_blank',
								// 	'top:150px;left:150px;height:500px;width:500px'
								// );
								// if (win && win !== null) {
								// 	win.onclose = (ev) => {
								// 		alert('closed');
								// 		(async () => {
								// 			try {
								// 				await dispatch(fetchLoggedUser());
								// 				props.history.replace('/');
								// 			} catch (err) {
								// 				console.log('err', err);
								// 				props.history.replace('/auth');
								// 			}
								// 		})();
								// 	};
								// }
							}}
						>
							GitHub
						</Button>
					</Grid>
				</Paper>
			</Container>
			<Modal
				aria-labelledby="edit-field-modal-title"
				className={classes.modal}
				open={openEditModal}
				onClose={() => setOpenEditModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openEditModal}>
					<Paper elevation={5} className={classes.modalPaper}>
						<IconButton
							aria-label="Close modal"
							color="primary"
							className={classes.modalClose}
							onClick={() => setOpenEditModal(false)}
						>
							<CloseRoundedIcon />
						</IconButton>
						<Grid container direction="column" spacing={2}>
							<Grid item>
								<Typography
									variant="h6"
									component="h2"
									id="edit-field-modal-title"
								>
									Enter New Value
								</Typography>
							</Grid>
							<Grid item>
								<TextField
									color="primary"
									value={formState.values.avatarUrl}
									type="text"
									disabled={loading}
									size="medium"
									error={!!formState.errors.avatarUrl}
									fullWidth
									name="avatarUrl"
									onChange={fieldChangeHandler}
									onBlur={fieldBlurHandler}
								/>
								{formState.errors.avatarUrl && (
									<p className={classes.fieldError}>
										{formState.errors.avatarUrl}
									</p>
								)}
							</Grid>
							<Grid item container justify="center">
								<Button
									color="primary"
									type="submit"
									onClick={() => setOpenEditModal(false)}
								>
									Ok
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Fade>
			</Modal>
		</>
	);
};

const useStyle = makeStyles((theme: Theme) => ({
	container: {
		height: '100vh',
		display: 'flex',
		justifyContent: 'stretch',
		alignItems: 'center',
	},
	paper: {
		width: '100%',
		padding: 30,
	},
	header: {
		paddingBottom: theme.spacing(2),
	},
	avatarBox: {
		position: 'relative',
		width: theme.spacing(12),
		height: theme.spacing(12),
		marginBottom: theme.spacing(1),
	},
	avatar: {
		width: '100%',
		height: '100%',
	},
	avatarCamera: {
		position: 'absolute',
		bottom: -10,
		right: -10,
		background: 'white',
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

	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalPaper: {
		padding: theme.spacing(1, 3),
		minWidth: 250,
		maxWidth: '90vw',
		position: 'relative',
	},
	modalClose: {
		position: 'absolute',
		right: 0,
		top: 0,
	},
}));

export default SignIn;
