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
	FormAction,
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

interface Props extends RouteComponentProps {}
type RouterParams = {
	flatId: string;
};

const defaultStartDay = moment().startOf('day');
const defaultEndDay = moment(defaultStartDay).add('months', 6);

const NewTask: FC<Props> = ({ history, match }) => {
	const classes = useStyles();
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
			timePeriodValue: '1',
			startDate: defaultStartDay,
			endDate: defaultEndDay,
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

	const fieldChangeHandler: ChangeEventHandler<HTMLInputElement> = (ev) => {
		const { name, value } = ev.target;

		const action: FormAction = {
			type: ActionType.UpdateValue,
			fieldId: name,
			value: value,
		};

		formDispatch(action);
	};

	const fieldBlurHandler: FocusEventHandler<HTMLInputElement> = (ev) => {
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

	const submitHandler: FormEventHandler = async (ev) => {
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

		const newTask = new Task({
			flatId: flat?.id!,
			startDate: formState.values.startDate.toDate(),
			endDate: formState.values.endDate.toDate(),
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
					const fieldName =
						x.param === 'startDate' || x.param === 'endDate'
							? 'dates'
							: x.param;
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
									error={!!formState.errors.dates}
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
									error={!!formState.errors.dates}
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
							{formState.errors.dates && (
								<Typography className={classes.fieldError}>
									{formState.errors.dates}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item>
						<TransferList
							listStyle={{
								minWidth: '225px',
							}}
							data={flat?.members!.map((user) => {
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
