import React, { useCallback, useState, useRef } from 'react';
import {
	makeStyles,
	Theme,
	Container,
	Grid,
	Typography,
	TextField,
	Avatar,
	Box,
	IconButton,
	CircularProgress,
	Button,
	Paper,
	useMediaQuery,
	useTheme
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import useForm, {
	ActionType,
	FormAction,
	FormState
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import { PhotoCamera, ErrorOutline } from '@material-ui/icons';
import { setFlat } from '../../store/actions/flat';
import Flat from '../../models/flat';
import validateFlatFormField from '../../utils/flatFormValidator';
import FlatMembersSearch from '../../components/Flat/FlatMembersSearch';
import User from '../../models/user';

interface Props {
	flatId: number | undefined;
}

const FlatDetails: React.FC<Props> = props => {
	const { flatId } = props;
	const classes = useStyles();

	const flat = useSelector((state: RootState) =>
		state.flats.flats.find(x => x.id === flatId)
	);
	const initialStateRef = useRef<FormState>({
		formValidity: !!flatId,
		values: {
			name: flat ? flat.name : '',
			description: flat ? flat.description : ''
		},
		errors: {
			name: null,
			description: null,
			avatarUrl: null
		}
	});

	const dispatch = useDispatch();

	const [formState, formDispatch] = useForm(initialStateRef.current);
	const [members, setMembers] = useState<User[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [textFieldSize, setTextFieldSize] = useState<'small' | 'medium'>(
		window.innerHeight > 700 ? 'medium' : 'small'
	);
	const theme = useTheme();
	const matchesSMSize = useMediaQuery(theme.breakpoints.up('sm'));

	const resizeHandler = useCallback(() => {
		let updatedSize: 'small' | 'medium' = 'small';
		if (window.innerHeight > 700) {
			updatedSize = 'medium';
		}
		setTextFieldSize(updatedSize);
	}, []);

	React.useEffect(() => {
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	});

	const fieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
		const { name, value } = ev.target;

		const action: FormAction = {
			type: ActionType.UpdateValue,
			fieldId: name,
			value: value
		};

		formDispatch(action);
	};

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = ev => {
		const { name } = ev.target;
		let error = validateFlatFormField(name, formState.values);

		const action: FormAction = {
			type: ActionType.SetError,
			fieldId: name,
			error: error
		};

		formDispatch(action);
	};

	const submitHandler: React.FormEventHandler = async (ev) => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = validateFlatFormField(name, formState.values);

			const action: FormAction = {
				type: ActionType.SetError,
				fieldId: name,
				error: error
			};

			formDispatch(action);
		}

		if (!formState.formValidity) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		const newFlat = new Flat({
			id: flat?.id,
			members: members.map(x => x.id),
			description: formState.values.description,
			name: formState.values.name,
		});

		try {
			await dispatch(setFlat(newFlat));
		} catch (err) {
			const errorData = new HttpErrorParser(err);
			const fieldsErrors = errorData.getFieldsErrors();
			fieldsErrors.forEach(x =>
				formDispatch({
					type: ActionType.SetError,
					fieldId: x.param,
					error: x.msg
				})
			);

			setError(errorData.getMessage());
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="md" className={classes.container}>
			<Paper className={classes.paper} elevation={5}>
				<Box className={classes.header}>
					<Typography variant="h3" align="center" color="primary">
						{props.flatId ? 'Edit flat' : 'Add Flat'}
					</Typography>
				</Box>
					<Grid container spacing={2} direction="column">
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
												required
												value={formState.values.name}
												error={!!formState.errors.name}
												onChange={fieldChangeHandler}
												onBlur={fieldBlurHandler}
											/>
											{formState.errors.name && (
												<p
													className={
														classes.fieldError
													}
												>
													{formState.errors.name}
												</p>
											)}
										</Grid>

										<Grid item>
											<TextField
												size={textFieldSize}
												name="description"
												placeholder={`eg. lodgings ${new Date().getFullYear()}/10 - ${new Date().getFullYear() +
													1}-07`}
												fullWidth
												variant="outlined"
												label="Description"
												type="text"
												multiline
												rows={2}
												rowsMax={4}
												value={
													formState.values.description
												}
												error={
													!!formState.errors
														.description
												}
												onChange={fieldChangeHandler}
												onBlur={fieldBlurHandler}
											/>
											{formState.errors.description && (
												<p
													className={
														classes.fieldError
													}
												>
													{
														formState.errors
															.description
													}
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
														style={{
															marginInlineEnd: 20
														}}
														color="error"
													/>
													<p
														className={
															classes.formErrorText
														}
													>
														{error}
													</p>
												</Box>
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
							<FlatMembersSearch />
							{formState.errors.name && (
								<p className={classes.fieldError}>
									{formState.errors.name}
								</p>
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
											paddingRight: 40
										}}
										onClick={submitHandler}
										variant="contained"
										color="primary"
										type="submit"
									>
										{props.flatId ? 'Update' : 'Create'}
									</Button>
								)}
							</Box>
						</Grid>
					</Grid>
			</Paper>
		</Container>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'stretch',
		alignItems: 'center'
	},
	title: {
		margin: theme.spacing(4, 0, 2)
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
	},
	formErrorText: {
		color: theme.palette.error.main,
		fontWeight: 'bold'
	}
}));

export default FlatDetails;
