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
import { RouteComponentProps } from 'react-router-dom';
import RootState from '../../store/storeTypes';
import { useSelector, useDispatch } from 'react-redux';
import { StateError } from '../../ReactTypes/customReactTypes';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import TransferList from '../../components/UI/TransferList';
import { fetchFlatMembers } from '../../store/actions/flats';
import { updatedTaskMembers } from '../../store/actions/tasks';

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

const UpdateTaskMembers: React.FC<Props> = ({ match, location, history }) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const taskId = +match.params.id;
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === taskId)
	)!;
	const flatMembers = useSelector(
		(state: RootState) =>
			state.flats.flats.find((x) => x.id === task.flatId)?.members
	);
	const [loadingFlatMembers, setLoadingFlatMembers] = useState(false);
	const [errorFlatMembers, setErrorFlatMembers] = useState<StateError>(null);
	const [members, setMembers] = useState<User[]>(task.members!);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!flatMembers && !loadingFlatMembers && !errorFlatMembers) {
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
		flatMembers,
		loadingFlatMembers,
		task.flatId,
	]);

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
						A change in the task members list will cause reset of the
						task schedule.
					</Typography>
				</Grid>
				<Grid item>
					{errorFlatMembers ? (
						<CustomMuiAlert
							severity="error"
							onClick={() => setError(null)}
						>
							{error}
						</CustomMuiAlert>
					) : !flatMembers || loadingFlatMembers ? (
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
									initialChecked: true,
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
								Create
							</Button>
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
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
	},
}));

export default UpdateTaskMembers;
