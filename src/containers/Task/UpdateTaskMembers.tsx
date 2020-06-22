import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	FormEventHandler,
} from 'react';
import {
	Typography,
	Box,
	Grid,
	Container,
	CircularProgress,
	Button,
	makeStyles,
	Theme,
} from '@material-ui/core';
import User from '../../models/user';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import RootState from '../../store/storeTypes';
import { useSelector, useDispatch } from 'react-redux';
import { StateError } from '../../ReactTypes/customReactTypes';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import TransferList from '../../components/UI/TransferList';
import { fetchFlatMembers, fetchFlat } from '../../store/actions/flats';
import { updatedTaskMembers } from '../../store/actions/tasks';
import { clearTaskPeriods } from '../../store/actions/periods';

export type NewFlatMember = {
	emailAddress: User['emailAddress'];
	userName: User['userName'];
};

export enum MembersStatus {
	'loading',
	'not_found',
	'accepted',
	'ok',
	'error',
	'invalid',
	'already_member',
}

interface Props {}
type RouterParams = {
	id: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const UpdateTaskMembers: React.FC<Props> = ({ match, history }) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const taskId = +match.params.id;
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === taskId)
	);
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === task?.flatId)
	);
	const flatMembers = flat?.members;
	const [loadingFlat, setLoadingFlat] = useState(false);
	const [errorFlat, setErrorFlat] = useState<StateError>(null);
	const [loadingFlatMembers, setLoadingFlatMembers] = useState(false);
	const [errorFlatMembers, setErrorFlatMembers] = useState<StateError>(null);
	const [members, setMembers] = useState<User[] | undefined>(task?.members!);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (
			task &&
			flat &&
			!flatMembers &&
			!loadingFlatMembers &&
			!errorFlatMembers
		) {
			const loadFlatMembers = async () => {
				setLoadingFlatMembers(true);
				setErrorFlatMembers(null);

				try {
					await dispatch(fetchFlatMembers(task.flatId!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setErrorFlatMembers(msg);
					}
				}
				if (isMounted.current) {
					setLoadingFlatMembers(false);
				}
			};

			loadFlatMembers();
		}
	}, [
		dispatch,
		errorFlatMembers,
		flat,
		flatMembers,
		loadingFlatMembers,
		task,
	]);

	useEffect(() => {
		if (task && !flat && !loadingFlat && !errorFlat) {
			const loadFlat = async () => {
				setLoadingFlat(true);
				setErrorFlat(null);

				try {
					await dispatch(fetchFlat(task.flatId!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setErrorFlat(msg);
					}
				}
				if (isMounted.current) {
					setLoadingFlat(false);
				}
			};
			loadFlat();
		}
	}, [dispatch, errorFlat, flat, loadingFlat, task]);

	const membersChangeHandler = useCallback(
		(newMembers: number[]) => {
			const selectedMembers = flatMembers!.filter((x) =>
				newMembers.includes(x.id)
			)!;
			setMembers(selectedMembers);
		},
		[flatMembers]
	);

	const submitHandler: FormEventHandler = async (ev) => {
		setLoading(true);
		setError(null);
		const updatedMembers = members!.map((x) => x.id);

		try {
			await dispatch(updatedTaskMembers(taskId, updatedMembers));
			dispatch(clearTaskPeriods(taskId));
			isMounted.current && history.replace('/tasks/' + taskId);
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const errCode = httpError.getCode();
				let msg: string;
				if (errCode === 422) {
					msg =
						'Sorry, something went wrong. Please try again later.';
				} else {
					msg = httpError.getMessage();
				}
				setError(msg);
				setLoading(false);
			}
		}
	};

	if (!task) {
		return <Redirect to={`/tasks/${taskId}`} />;
	}

	return (
		<Container maxWidth="sm">
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Box width="100%">
						<Typography variant="h3" component="h1" color="primary">
							Update tasks members
						</Typography>
					</Box>
				</Grid>
				<Grid item>
					<Typography variant="h5">
						A change in the task members list will cause reset of
						the task schedule.
					</Typography>
				</Grid>
				<Grid item>
					{errorFlatMembers || errorFlat ? (
						<CustomMuiAlert
							severity="error"
							onClick={() => setError(null)}
						>
							Sorry could not load all required data, please try
							again later.
						</CustomMuiAlert>
					) : !flat ||
					  loadingFlat ||
					  !flatMembers ||
					  loadingFlatMembers ? (
						<CircularProgress />
					) : (
						<TransferList
							listStyle={{
								minWidth: '225px',
							}}
							data={flatMembers!.map((user) => {
								return {
									id: user.id,
									labelPrimary: user.emailAddress,
									labelSecondary: user.userName,
									initialChecked:
										members!.findIndex(
											(x) => x.id === user.id
										) !== -1,
								};
							})}
							onChanged={membersChangeHandler}
							disabled={loading}
						/>
					)}
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
							<>
								<Button
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									disabled={loading}
									onClick={() =>
										history.replace(`/tasks/${taskId}`)
									}
									color="primary"
									type="button"
								>
									Cancel
								</Button>
								<Button
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									disabled={loading}
									onClick={submitHandler}
									variant="contained"
									color="primary"
									type="submit"
								>
									Update
								</Button>
							</>
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
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
		justifyContent: 'space-around',
		alignItems: 'center',
		display: 'flex',
	},
}));

export default UpdateTaskMembers;
