import React, { useState, useRef, useCallback } from 'react';
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
	Slide
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import useForm, { FormState, Action, ActionType } from '../../../hooks/useForm';
import validateAuthFormField from '../../../utils/authFormValidator';
import { authorize } from '../../../store/actions/auth';
import { Credentials } from '../../../models/auth';

const useStyle = makeStyles((theme: Theme) => ({
	container: {
		height: '100vh',

		display: 'flex',
		justifyContent: 'stretch',
		alignItems: 'center'
	},
	paper: {
		width: '100%',
		padding: 30
	},
	header: {
		paddingBottom: theme.spacing(2)
	},
	avatarBox: {
		position: 'relative',
		width: theme.spacing(12),
		height: theme.spacing(12)
	},
	avatar: {
		width: '100%',
		height: '100%'
	},
	avatarCamera: {
		position: 'absolute',
		bottom: -10,
		right: -10,
		background: 'white'
	},
	fieldError: {
		color: theme.palette.error.main,
		fontSize: '0.7em',
		height: '0.8em',
		marginBlockStart: '0.2em'
	},
	submitWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex'
	}
}));

const initialState: FormState = {
	formValidity: false,
	values: {
		name: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
		avatarUrl: ''
	},
	errors: {
		name: null,
		emailAddress: null,
		password: null,
		confirmPassword: null,
		avatarUrl: null
	}
};

const SignIn = () => {
	const classes = useStyle();

	const dispatch = useDispatch();

	const [formState, formDispatch] = useForm(initialState);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSignIn, setIsSignIn] = useState(false);
	const [textFieldSize, setTextFieldSize] = useState<'small' | 'medium'>(
		window.innerHeight > 700 ? 'medium' : 'small'
	);

	const refCnt = useRef(0);
	console.log('rendered', ++refCnt.current);

	const resizeHandler = useCallback(() => {
		if (!isSignIn) {
			let updatedSize: 'small' | 'medium' = 'small';
			if (window.innerHeight > 700) {
				updatedSize = 'medium';
			}
			setTextFieldSize(updatedSize);
		} else {
			setTextFieldSize('medium');
		}
	}, [isSignIn]);

	React.useEffect(() => {
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	});

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name, value } = ev.target;

		const action: Action = {
			type: ActionType.UpdateValue,
			fieldId: name,
			isValid: value.trim().length === 0,
			value: value
		};

		formDispatch(action);
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = ev => {
		const { name } = ev.target;
		let error = validateAuthFormField(name, formState.values, isSignIn);

		const action: Action = {
			type: ActionType.SetError,
			fieldId: name,
			error: error
		};

		formDispatch(action);
	};

	const submitHandler: React.FormEventHandler = async () => {
		
		setError(null);
		setLoading(true);
		const credentials = new Credentials({
			userName: formState.values.name,
			emailAddress: formState.values.emailAddress,
			password: formState.values.password,
			confirmPassword: formState.values.confirmPassword,
		});
		try {
			await dispatch(authorize(credentials, isSignIn));
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" className={classes.container}>
			<Paper className={classes.paper} elevation={5}>
				<Box className={classes.header}>
					<Typography variant="h3" align="center" color="primary">
						Sign Up
					</Typography>
				</Box>
				<form noValidate onSubmit={ev => ev.preventDefault()}>
					<Grid
						container
						direction="column"
						alignItems="stretch"
						justify="center"
						spacing={2}
					>
						<Box justifyContent="center" display="flex">
							<Box
								className={classes.avatarBox}
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<Avatar
									alt="user avatar"
									src={
										isSignIn
											? formState.values.avatarUrl
											: ''
									}
									className={classes.avatar}
								/>
								{!isSignIn && (
									<IconButton
										className={classes.avatarCamera}
										color="primary"
										aria-label="upload picture"
										component="span"
									>
										<PhotoCamera />
									</IconButton>
								)}
							</Box>
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
									name="name"
									fullWidth
									variant="outlined"
									label="Name"
									required
									value={formState.values.name}
									error={!!formState.errors.name}
									onChange={fieldChangeHandler}
									onBlur={fieldBlurHandler}
								/>
								{formState.errors.name && (
									<p className={classes.fieldError}>
										{formState.errors.name}
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
									setIsSignIn(prevState => !prevState);
									resizeHandler();
								}}
								variant="body2"
								style={{ cursor: 'pointer' }}
							>
								{`Switch to ${
									isSignIn ? 'Sign Up' : 'Sign In'
								}`}
							</Link>
						</Grid>

						<Grid item>
							<Box className={classes.submitWrapper}>
								<Button
									style={{
										paddingLeft: 40,
										paddingRight: 40
									}}
									onClick={submitHandler}
									variant="contained"
									color="primary"
									type="submit"
								>
									Sign Up
								</Button>
							</Box>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default SignIn;
