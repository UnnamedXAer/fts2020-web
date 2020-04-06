import React, { useCallback, useState, useRef } from 'react';
import {
	makeStyles,
	Theme,
	Grid,
	Typography,
	TextField,
	Box,
	CircularProgress,
	Button,
	useMediaQuery,
	useTheme,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@material-ui/core';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import moment from 'moment';
import useForm, {
	ActionType,
	FormAction,
	FormState,
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import Flat from '../../models/flat';
import validateTaskFormField, {
	validateTaskDate,
} from '../../utils/taskFormValidator';
import User from '../../models/user';
import { createFlat } from '../../store/actions/flats';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { RouteComponentProps } from 'react-router-dom';
import TransferList from '../../components/UI/TransferList';
import Task, { TaskPeriodUnit } from '../../models/task';
import { TaskFormValues } from '../../utils/taskFormValidator';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface Props extends RouteComponentProps {}
type RouterParams = {
	flatId: string;
};

const NewTask: React.FC<Props> = ({ history, match }) => {
	const classes = useStyles();
	const loggedUser = useSelector<RootState, User>(
		(state) => state.auth.user!
	);
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find(
			(x) => x.id === +(match.params as RouterParams).flatId
		)
	);
	const initialFormStateRef = useRef<FormState<TaskFormValues>>({
		formValidity: false,
		values: {
			name: '',
			description: '',
			timePeriodUnit: TaskPeriodUnit.WEEK,
			timePeriodValue: 1,
			startDate: moment(),
			endDate: moment().add(6, 'months'),
		},
		errors: {
			name: null,
			description: null,
			dates: null,
			timePeriodValue: null,
		},
	});

	const dispatch = useDispatch();

	const [formState, formDispatch] = useForm<TaskFormValues>(
		initialFormStateRef.current
	);
	const [members, setMembers] = useState<User[]>(flat!.members!);
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

	const fieldBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
		ev
	) => {
		const { name } = ev.target;
		let error = validateTaskFormField(name, formState.values);

		const action: FormAction = {
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		};

		formDispatch(action);
	};

	const dateChangeHandler = (
		fieldName: 'startDate' | 'endDate',
		date: MaterialUiPickersDate
	) => {
		const error = validateTaskDate(fieldName, formState.values, date);
		const errorAction: FormAction = {
			type: ActionType.SetError,
			fieldId: 'dates',
			error: error,
		};
		formDispatch(errorAction);

		const valueAction: FormAction<MaterialUiPickersDate> = {
			type: ActionType.UpdateValue,
			fieldId: fieldName,
			value: date,
		};
		formDispatch(valueAction);
	};

	const membersChangeHandler = useCallback(
		(newMembers: number[]) => {
			const selectedMembers = flat?.members?.filter((x) =>
				newMembers.includes(x.id)
			)!;
			setMembers(selectedMembers);
		},
		[flat]
	);

	const submitHandler: React.FormEventHandler = async (ev) => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = validateTaskFormField(name, formState.values);

			const action: FormAction = {
				type: ActionType.SetError,
				fieldId:
					name === 'startDate' || name === 'endDate' ? 'dates' : name,
				error: error,
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
			members: members,
			description: formState.values.description,
			name: formState.values.name,
			ownerId: loggedUser.id,
		});

		try {
			await dispatch(createFlat(newFlat));
			history.replace('/flats');
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
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<Box className={classes.header}>
				<Typography variant="h3" align="center" color="primary">
					Add Task
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
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="row"
						justify="space-around"
						alignItems="center"
					>
						<Grid item>
							<TextField
								size={textFieldSize}
								name="timePeriodValue"
								fullWidth
								variant="outlined"
								label="Period duration values"
								type="number"
								disabled={loading}
								rows={1}
								value={formState.values.timePeriodValue}
								error={!!formState.errors.timePeriodValue}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
						</Grid>
						<Grid item>
							<FormControl variant="outlined" size={textFieldSize}>
								<InputLabel id="timePeriodUnit-label-id">
									Age
								</InputLabel>
								<Select
									labelId="timePeriodUnit-label-id"
									id="timePeriodUnit-id"
									name="timePeriodUnit"
									value={formState.values.timePeriodUnit}
									onChange={(ev, el) => {
										fieldChangeHandler(
											ev as React.ChangeEvent<
												HTMLInputElement
											>
										);
									}}
									label="Period duration Unit"
								>
									{Object.keys(TaskPeriodUnit).map((key) => {
										return (
											<MenuItem key={key} value={key}>
												{key}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Grid item>
						<KeyboardDatePicker
							value={formState.values.startDate}
							onChange={(date) =>
								dateChangeHandler('startDate', date)
							}
							minDate={new Date()}
							// format="MM/dd/yyyy"
						/>
						<KeyboardDatePicker
							value={formState.values.endDate}
							onChange={(date) =>
								dateChangeHandler('endDate', date)
							}
							minDate={new Date()}
							// format="MM/dd/yyyy"
						/>
						{formState.errors.dates && (
							<p className={classes.fieldError}>
								{formState.errors.dates}
							</p>
						)}
					</Grid>
					<Grid item>
						<TransferList
							data={flat?.members!.map((user) => {
								return {
									id: user.id,
									labelPrimary: user.emailAddress,
									labelSecondary: user.userName,
									initialChecked: true,
								};
							})}
							onChanged={membersChangeHandler}
						/>
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
		</MuiPickersUtilsProvider>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		margin: theme.spacing(4, 0, 2),
	},
	paper: {
		padding: 30,
		margin: 20,
	},
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
	formErrorText: {
		color: theme.palette.error.main,
		fontWeight: 'bold',
	},
}));

export default NewTask;
