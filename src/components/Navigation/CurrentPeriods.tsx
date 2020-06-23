import React, { useRef, useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Divider,
	makeStyles,
	Theme,
	createStyles,
	IconButton,
	CircularProgress,
	Link,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { StateError } from '../../ReactTypes/customReactTypes';
import {
	fetchCurrentPeriods,
	completePeriod,
} from '../../store/actions/periods';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import AlertSnackbar, { AlertSnackbarData } from '../UI/AlertSnackbar';
import AlertDialog, { AlertDialogData } from '../UI/AlertDialog';
import { CurrentPeriod } from '../../models/period';

interface Props {}

const CurrentPeriods: React.FC<Props> = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const periods = useSelector(
		(state: RootState) => state.periods.currentPeriods
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [periodsLoading, setPeriodsLoading] = useState<{
		[id: number]: boolean;
	}>({});
	const [snackbarData, setSnackbarData] = useState<AlertSnackbarData>({
		content: '',
		onClose: () => {},
		open: false,
	});
	const [dialogData, setDialogData] = useState<AlertDialogData>({
		content: '',
		onClose: () => {},
		title: '',
		loading: false,
		open: false,
	});

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!periods && !loading && !error) {
			setLoading(true);
			setError(null);
			const loadCurrentPeriods = async () => {
				try {
					await dispatch(fetchCurrentPeriods());
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setError(msg);
					}
				}
				if (isMounted.current) {
					setLoading(false);
				}
			};
			loadCurrentPeriods();
		}
	}, [dispatch, error, loading, periods]);

	const closeSnackbarAlertHandler = () => {
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const closeDialogAlertHandler = () =>
		setDialogData((prevState) => ({
			...prevState,
			open: prevState.loading,
		}));

	const periodClickHandler = async (period: CurrentPeriod) => {
		setDialogData({
			open: true,
			content: `Complete period for task: "${period.taskName}"?`,
			title: 'Complete Period',
			onClose: closeDialogAlertHandler,
			loading: false,
			actions: [
				{
					label: 'Yes',
					onClick: () =>
						completePeriodHandler(period.id, period.taskId),
					color: 'primary',
				},
				{
					color: 'secondary',
					label: 'Cancel',
					onClick: closeDialogAlertHandler,
				},
			],
		});
	};

	const completePeriodHandler = async (id: number, taskId: number) => {
		setPeriodsLoading((prevState) => ({ ...prevState, [id]: true }));
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(completePeriod(id, taskId));
			isMounted.current &&
				setSnackbarData({
					open: true,
					action: true,
					severity: 'success',
					timeout: 3000,
					content: 'Period completed.',
					onClose: closeSnackbarAlertHandler,
				});
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					action: true,
					severity: 'error',
					timeout: 4000,
					content: msg,
					onClose: closeSnackbarAlertHandler,
					title: 'Could not complete the period.',
				});
			}
		}
		if (isMounted.current) {
			setPeriodsLoading((prevState) => ({
				...prevState,
				[id]: false,
			}));
			setDialogData((prevState) => ({ ...prevState, open: false }));
		}
	};

	return (
		<Box display="flex" flexDirection="column" className={classes.root}>
			<Typography
				align="center"
				variant="overline"
				className={classes.title}
			>
				Your turn for:
			</Typography>
			{error ? (
				<Box className={classes.notPeriodItemsContainer}>
					<CustomMuiAlert severity="error" variant="outlined">
						{error}
					</CustomMuiAlert>
				</Box>
			) : loading ? (
				<Box className={classes.notPeriodItemsContainer}>
					<Skeleton height={60} />
					<Skeleton height={60} />
				</Box>
			) : (
				<>
					{periods &&
						(periods.length === 0 ? (
							<Box className={classes.notPeriodItemsContainer}>
								<CustomMuiAlert
									severity="info"
									variant="outlined"
								>
									Currently You have nothing to do{' '}
									<span
										role="img"
										aria-label="like a boss emoji"
									>
										😎
									</span>
								</CustomMuiAlert>
							</Box>
						) : (
							<Box component="ul" className={classes.periodsList}>
								{periods.map((period, i) => (
									<Box
										component="li"
										key={period.id + Math.random()}
										className={classes.periodListItem}
										style={
											i === 0 ? { paddingTop: 1 } : void 0
										}
									>
										<Box
											display="flex"
											justifyContent="space-between"
											alignItems="center"
										>
											<Link
												className={classes.taskName}
												variant="subtitle1"
												title={
													'Task: ' + period.taskName
												}
												component={RouterLink}
												to={`/tasks/${period.taskId}`}
												noWrap
											>
												{period.taskName}
											</Link>
											<IconButton
												title="Complete"
												size="small"
												onClick={(ev) => {
													ev.stopPropagation();
													periodClickHandler(period);
												}}
											>
												{periodsLoading[period.id] ? (
													<CircularProgress
														color="primary"
														size={16}
													/>
												) : (
													<DoneRoundedIcon fontSize="small" />
												)}
											</IconButton>
										</Box>
										<Typography
											variant="body1"
											className={classes.date}
										>
											Start:{' '}
											{moment(period.startDate).format(
												'dddd, Do MMM YYYY'
											)}
										</Typography>
										<Typography
											variant="body1"
											className={classes.date}
										>
											End:{' '}
											{moment(period.endDate).format(
												'dddd, Do MMM YYYY'
											)}
										</Typography>
										{i < periods.length - 1 && <Divider />}
									</Box>
								))}
							</Box>
						))}
				</>
			)}
			<AlertSnackbar data={snackbarData} />
			<AlertDialog data={dialogData} />
		</Box>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingBottom: theme.spacing(1),
			overflowX: 'hidden',
			overflowY: 'auto',
		},
		title: {
			paddingTop: theme.spacing(1),
			position: 'sticky',
			top: 0,
			backgroundColor: theme.palette.background.paper,
			zIndex: 1,
		},
		notPeriodItemsContainer: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			paddingBlockEnd: '10px',
		},
		periodsList: {
			marginBlockStart: 0,
			marginBlockEnd: 0,
			paddingInlineStart: 0,
		},
		periodListItem: {
			listStyle: 'none',
			'&:hover': {
				backgroundColor: theme.palette.grey[200],
			},
		},
		date: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			fontSize: '0.8rem',
			color: theme.palette.grey.A700,
		},
		taskName: {
			fontSize: '0.9rem',
			fontWeight: 500,
			position: 'relative',
			marginLeft: 4,
			marginRight: 4,
			paddingLeft: 4,
			paddingRight: 4,

			'&:hover': {
				zIndex: 1,
				textDecoration: 'none',
				'&::before': {
					position: 'absolute',
					bottom: 0,
					padding: '0 8px',
					left: 0,
					content: '""',
					backgroundColor: theme.palette.info.light,
					opacity: 0.5,
					width: 'calc(100% + 60px)',
					transform: 'scaleX(0)',
					height: 3,
					animation: `$animateHover 1100ms ${theme.transitions.easing.easeInOut}`,
					animationFillMode: 'forwards',
					zIndex: -1,
				},
			},
		},
		'@keyframes animateHover': {
			'0%': {
				transform: 'scaleX(0)',
				height: 3,
			},
			'40%': {
				transform: 'scaleX(1.2)',
				height: 3,
			},
			'100%': {
				height: 'calc(100% + 4px)',
				transform: 'scaleX(1.2)',
			},
		},
	})
);

export default CurrentPeriods;
