import React, {
	useCallback,
	useState,
	useRef,
	FC,
	useEffect,
	ChangeEventHandler,
	FocusEventHandler,
	FormEventHandler,
	ChangeEvent,
	useReducer,
} from 'react';
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
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import moment from 'moment';
import useForm, {
	ActionType,
	FormState,
} from '../../hooks/useForm';
import HttpErrorParser from '../../utils/parseError';
import validateTaskFormField, {
	validateTaskDate,
} from '../../utils/taskFormValidator';
import User from '../../models/user';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { RouteComponentProps } from 'react-router-dom';
import TransferList from '../../components/UI/TransferList';
import Task, { TaskPeriodUnit } from '../../models/task';
import { TaskFormValues } from '../../utils/taskFormValidator';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { createTask } from '../../store/actions/tasks';
import { fetchFlat, fetchFlatMembers } from '../../store/actions/flats';
import { StateError } from '../../ReactTypes/customReactTypes';

interface Props extends RouteComponentProps {}
type RouterParams = {
	flatId: string;
};

const elementsInitState = {
	loading: {
		members: false,
		flat: false,
	},
	error: {
		members: null,
		flat: null,
	},
	loaded: {
		members: false,
		flat: false,
	},
};

type ElementsState = typeof elementsInitState;
type ElementsName = keyof ElementsState['loading'];
type ElementsAction = {
	type: 'loading' | 'not-loading' | 'error' | 'not-error';
	name: ElementsName;
	payload?: StateError;
};

type ElementsReducer = (
	state: ElementsState,
	action: ElementsAction
) => ElementsState;

const elementsReducer: ElementsReducer = (state, action) => {
	if (action.type === 'loading' || action.type === 'not-loading') {
		return {
			...state,
			loading: {
				...state.loading,
				[action.name]: action.type === 'loading',
			},
			loaded: {
				...state.loaded,
				[action.name]: true,
			},
		};
	} else {
		return {
			...state,
			error: { ...state.error, [action.name]: action.payload },
		};
	}
};

const defaultStartDay = moment().startOf('day');
const defaultEndDay = moment(defaultStartDay).add(6, 'months');

const NewTask: FC<Props> = ({ history, match }) => {
	const classes = useStyles();
	const flatId = +(match.params as RouterParams).flatId;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === flatId)
	);
	const initialFormStateRef = useRef<FormState<TaskFormValues>>({
		formValidity: false,
		values: {
			name: '',
			description: '',
			timePeriodUnit: TaskPeriodUnit.WEEK,
			timePeriodValue: '1',
			startDate: defaultStartDay,
			endDate: defaultEndDay,
		},
		errors: {
			name: null,
			description: null,
			endDate: null,
			startDate: null,
			timePeriodValue: null,
			timePeriodUnit: null,
		},
	});

	const dispatch = useDispatch();

	const [formState, formDispatch] = useForm<TaskFormValues>(
		initialFormStateRef.current
	);
	const [members, setMembers] = useState<User[]>(
		flat?.members ? flat.members : []
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [elements, elementsDispatch] = useReducer(elementsReducer, {
		...elementsInitState,
		loaded: {
			flat: !!flat,
			members: !!flat?.members,
		},
	} as ElementsState);

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
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	});

	useEffect(() => {
		if (!elements.loaded.flat) {
			const loadFlat = async () => {
				elementsDispatch({ name: 'flat', type: 'loading' });
				try {
					await dispatch(fetchFlat(flatId));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'flat',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current) {
					elementsDispatch({ name: 'flat', type: 'not-loading' });
				}
			};

			loadFlat();
		}
	}, [dispatch, elements.loaded.flat, flatId]);

	useEffect(() => {
		if (flat && !elements.loaded.members) {
			const loadFlat = async () => {
				elementsDispatch({ name: 'members', type: 'loading' });
				try {
					await dispatch(fetchFlatMembers(flat.id!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						elementsDispatch({
							name: 'members',
							type: 'error',
							payload: msg,
						});
					}
				}
				if (isMounted.current) {
					elementsDispatch({ name: 'members', type: 'not-loading' });
				}
			};

			loadFlat();
		}
	}, [dispatch, elements.loaded.members, flat]);

	const fieldChangeHandler: ChangeEventHandler<HTMLInputElement> = (ev) => {
		const { name, value } = ev.target as {
			value: string;
			name: keyof TaskFormValues;
		};

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: name,
			value: value,
		});
	};

	const fieldBlurHandler: FocusEventHandler<HTMLInputElement> = (ev) => {
		const { name } = ev.target as { name: keyof TaskFormValues };
		let error = validateTaskFormField(name, formState.values);

		formDispatch({
			type: ActionType.SetError,
			fieldId: name,
			error: error,
		});
	};

	const dateChangeHandler = (
		fieldName: 'startDate' | 'endDate',
		date: MaterialUiPickersDate
	) => {
		const error = validateTaskDate(fieldName, formState.values, date);

		formDispatch({
			type: ActionType.SetError,
			fieldId: 'startDate',
			error: error,
		});

		formDispatch({
			type: ActionType.UpdateValue,
			fieldId: fieldName,
			value: date,
		});
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

	const submitHandler: FormEventHandler = async (ev) => {
		setError(null);
		setLoading(true);

		for (const name in formState.values) {
			let error = validateTaskFormField(
				name as keyof TaskFormValues,
				formState.values
			);

			formDispatch({
				type: ActionType.SetError,
				fieldId:
					name === 'endDate'
						? 'startDate'
						: (name as keyof TaskFormValues),
				error: error,
			});
		}

		if (!formState.formValidity) {
			setError('Please correct marked fields.');
			setLoading(false);
			return;
		}

		const newTask = new Task({
			flatId: flat?.id!,
			startDate: formState.values.startDate!.toDate(),
			endDate: formState.values.endDate!.toDate(),
			timePeriodUnit: formState.values.timePeriodUnit,
			timePeriodValue: +formState.values.timePeriodValue,
			members: members,
			description: formState.values.description,
			name: formState.values.name,
		});

		try {
			await dispatch(createTask(newTask));
			isMounted.current && history.replace('/flats/' + flat?.id);
		} catch (err) {
			if (isMounted.current) {
				const errorData = new HttpErrorParser(err);
				const fieldsErrors = errorData.getFieldsErrors();
				fieldsErrors.forEach((x) => {
					const fieldName = 'startDate';
					formDispatch({
						type: ActionType.SetError,
						fieldId: fieldName,
						error: x.msg,
					});
				});
				setError(errorData.getMessage());
				setLoading(false);
			}
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
					style={{ maxWidth: '700px' }}
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
											inputProps={{ tabIndex: 1 }}
											size={textFieldSize}
											name="name"
											placeholder="weekly cleaning"
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
											<Typography
												className={classes.fieldError}
											>
												{formState.errors.name}
											</Typography>
										)}
									</Grid>

									<Grid item>
										<TextField
											inputProps={{ tabIndex: 1 }}
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
											<Typography
												className={classes.fieldError}
											>
												{formState.errors.description}
											</Typography>
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
						spacing={2}
					>
						<Grid item>
							<FormControl
								variant="outlined"
								size={textFieldSize}
								fullWidth
							>
								<InputLabel
									id="timePeriodUnit-label-id"
									htmlFor="timePeriodUnit-id"
								>
									Period duration Unit
								</InputLabel>
								<Select
									inputProps={{ tabIndex: 1 }}
									style={{ width: '185px' }}
									id="timePeriodUnit-id"
									name="timePeriodUnit"
									labelId="timePeriodUnit-label-id"
									label="Period duration Unit"
									value={formState.values.timePeriodUnit}
									onChange={(ev, el) => {
										fieldChangeHandler(
											ev as ChangeEvent<HTMLInputElement>
										);
									}}
									disabled={loading}
								>
									<MenuItem value={'DAY'}>Day</MenuItem>
									<MenuItem value={'WEEK'}>Week</MenuItem>
									<MenuItem value={'MONTH'}>Month</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item>
							<TextField
								style={{ width: '185px' }}
								size={textFieldSize}
								name="timePeriodValue"
								variant="outlined"
								label="Period duration value"
								type="number"
								inputMode="numeric"
								required
								inputProps={{
									max: 30,
									min: 1,
									tabIndex: 1,
								}}
								disabled={loading}
								value={formState.values.timePeriodValue}
								error={!!formState.errors.timePeriodValue}
								onChange={fieldChangeHandler}
								onBlur={fieldBlurHandler}
							/>
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Grid
							item
							container
							direction="row"
							justify="space-around"
							alignItems="center"
							spacing={2}
						>
							<Grid item>
								<DatePicker
									inputProps={{ tabIndex: 1 }}
									error={!!formState.errors.startDate}
									label="Start Date"
									inputVariant="outlined"
									value={formState.values.startDate}
									onChange={(date) =>
										dateChangeHandler('startDate', date)
									}
									minDate={new Date()}
									format="MMM Do YYYY"
								/>
							</Grid>
							<Grid item>
								<DatePicker
									inputProps={{ tabIndex: 1 }}
									error={!!formState.errors.startDate}
									label="End Date"
									inputVariant="outlined"
									value={formState.values.endDate}
									onChange={(date) =>
										dateChangeHandler('endDate', date)
									}
									minDate={new Date()}
									format="MMM Do YYYY"
								/>
							</Grid>
						</Grid>
						<Grid item>
							{formState.errors.startDate && (
								<Typography className={classes.fieldError}>
									{formState.errors.startDate}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item>
						<TransferList
							listStyle={{
								minWidth: '225px',
							}}
							data={flat?.members?.map((user) => {
								return {
									id: user.id,
									labelPrimary: user.emailAddress,
									labelSecondary: user.userName,
									initialChecked: true,
								};
							})}
							onChanged={membersChangeHandler}
							disabled={loading}
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
									tabIndex={1}
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
	header: {
		paddingBottom: theme.spacing(2),
	},
	gridContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
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

export default NewTask;
