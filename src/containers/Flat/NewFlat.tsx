import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
	makeStyles,
	Theme,
	Grid,
	Typography,
	TextField,
	Avatar,
	Box,
	IconButton,
	CircularProgress,
	Button,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import useForm, {
	ActionType,
	FormAction,
	FormState,
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import { PhotoCamera } from '@material-ui/icons';
import { FlatData } from '../../models/flat';
import validateFlatFormField, {
	FlatFormValues,
} from '../../utils/flatFormValidator';
import { createFlat } from '../../store/actions/flats';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { StateError } from '../../ReactTypes/customReactTypes';
import RootState from '../../store/storeTypes';
import { getRandomInt } from '../../utils/random';

interface Props extends RouteComponentProps {}

const descriptionPlaceholder = `eg. lodgings ${new Date().getFullYear()}/10 - ${
	new Date().getFullYear() + 1
}-07`;

const NewFlat: React.FC<Props> = ({ history }) => {
	const classes = useStyles();

	const initialFormStateRef = useRef<FormState<FlatFormValues>>({
		formValidity: false,
		values: {
			name: '',
			description: '',
			avatarUrl: '',
		},
		errors: {
			name: null,
			description: null,
			avatarUrl: null,
		},
	});

	const dispatch = useDispatch();
	const [tmpFlatId] = useState(
		String.fromCharCode(getRandomInt(97, 123)) + Date.now()
	);
	const flatId = useSelector(
		(state: RootState) => state.flats.createdFlatsTmpIds[tmpFlatId]
	);
	const [formState, formDispatch] = useForm(initialFormStateRef.current);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [textFieldSize, setTextFieldSize] = useState<'small' | 'medium'>(
		window.innerHeight > 700 ? 'medium' : 'small'
	);
	const theme = useTheme();
	const matchesSMSize = useMediaQuery(theme.breakpoints.up('sm'));
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const resizeHandler = useCallback(() => {
		let updatedSize: 'small' | 'medium' = 'small';
		if (window.innerHeight > 700) {
			updatedSize = 'medium';
		}
		setTextFieldSize(updatedSize);
	}, []);

	useEffect(() => {
		if (flatId) {
			history.replace(`/flats/${flatId}/invite-members?new=flat`);
		}
	}, [flatId, history]);

	useEffect(() => {
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	});

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name, value } = ev.target as {
			name: keyof FlatFormValues;
			value: string;
		};

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: name,
			value: value,
		});
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name } = ev.target as { name: keyof FlatFormValues };
		let error = validateFlatFormField(name, formState.values);

		formDispatch({
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		});
	};

	const submitHandler: React.FormEventHandler = async (ev) => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = validateFlatFormField(
				name as keyof FlatFormValues,
				formState.values
			);

			const action: FormAction<keyof FlatFormValues, StateError> = {
				type: ActionType.SetError,
				fieldId: name as keyof FlatFormValues,
				error: error,
			};

			formDispatch(action);
		}

		if (!formState.formValidity) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		const newFlat = new FlatData({
			description: formState.values.description,
			name: formState.values.name,
		});

		try {
			await dispatch(createFlat(newFlat, tmpFlatId));
		} catch (err) {
			if (isMounted.current) {
				const errorData = new HttpErrorParser(err);
				const fieldsErrors = errorData.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					formDispatch({
						type: ActionType.SetError,
						fieldId: x.param as keyof FlatFormValues,
						error: x.msg,
					})
				);

				setError(errorData.getMessage());
				setLoading(false);
			}
		}
	};

	return (
		<>
			<Box className={classes.header}>
				<Typography variant="h3" align="center" color="primary">
					Add Flat
				</Typography>
			</Box>
			<Box className={classes.gridContainer}>
				<Grid
					container
					spacing={2}
					direction="column"
					style={{ maxWidth: '550px' }}
				>
					<Grid item>
						<Typography paragraph>
							Every "Flat" represent a group of people most likely
							living together in apartment. That flats could be
							used to track repetitive tasks such as weekly
							cleaning or taking out the trash where those tasks
							are executed in queue by members.
						</Typography>
						<Typography
							variant="caption"
							color="textSecondary"
							paragraph
						>
							Members for the flat could be invited on next screen
							or later from flat details option.
						</Typography>
						<Typography
							variant="caption"
							color="textSecondary"
							paragraph
						>
							Flat name or description do not required real
							informations they are just for you and your
							flatmates to easily corelate place with flat in
							application.
						</Typography>
					</Grid>
					<Grid item>
						<Grid
							item
							container
							spacing={2}
							direction={matchesSMSize ? 'row' : 'column'}
							justify="space-between"
							alignItems="stretch"
						>
							<Grid item style={{ flex: 1 }}>
								<Grid
									item
									container
									spacing={2}
									direction="column"
								>
									<Grid item>
										<TextField
											size={textFieldSize}
											name="name"
											placeholder="eg. flat, avenue 12a"
											fullWidth
											variant="outlined"
											label="Name"
											type="text"
											disabled={loading}
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

									<Grid item>
										<TextField
											size={textFieldSize}
											name="description"
											placeholder={descriptionPlaceholder}
											fullWidth
											variant="outlined"
											label="Description"
											type="text"
											disabled={loading}
											multiline
											rows={2}
											rowsMax={4}
											value={formState.values.description}
											error={
												!!formState.errors.description
											}
											onChange={fieldChangeHandler}
											onBlur={fieldBlurHandler}
										/>
										{formState.errors.description && (
											<p className={classes.fieldError}>
												{formState.errors.description}
											</p>
										)}
									</Grid>
								</Grid>
							</Grid>

							<Grid item md={3} style={{ display: 'none' }}>
								<Box justifyContent="center" display="flex">
									<Box
										className={classes.avatarBox}
										display="flex"
										alignItems="center"
										justifyContent="center"
									>
										<Avatar
											alt="flat avatar"
											src={formState.values.avatarUrl}
											className={classes.avatar}
										/>
										<IconButton
											className={classes.avatarCamera}
											color="primary"
											aria-label="upload picture"
											component="span"
											title="Add flat avatar"
										>
											<PhotoCamera />
										</IconButton>
									</Box>
								</Box>
							</Grid>
						</Grid>
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
									disabled={!formState.formValidity}
									onClick={submitHandler}
									variant="contained"
									color="primary"
									type="submit"
								>
									Create
								</Button>
							)}
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	header: {
		paddingBottom: theme.spacing(2),
	},
	gridContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
	},
	avatarBox: {
		position: 'relative',
		width: theme.spacing(12),
		height: theme.spacing(12),
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
}));

export default NewFlat;
