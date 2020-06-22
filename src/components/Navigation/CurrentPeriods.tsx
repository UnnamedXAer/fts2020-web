import React, { useRef, useEffect, useState } from 'react';
import { Box, List, Typography, Divider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { StateError } from '../../ReactTypes/customReactTypes';
import { fetchCurrentPeriods } from '../../store/actions/periods';
import HttpErrorParser from '../../utils/parseError';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import Skeleton from '@material-ui/lab/Skeleton';

interface Props {}

const CurrentPeriods: React.FC<Props> = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const periods = useSelector(
		(state: RootState) => state.periods.currentPeriods
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

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
					const httpError = new HttpErrorParser(err);
					const msg = httpError.getMessage();
					setError(msg);
				}
				if (isMounted.current) {
					setLoading(false);
				}
			};

			loadCurrentPeriods();
		}
	}, [dispatch, error, loading, periods]);

	return (
		<Box display="flex" flexDirection="column">
			<Typography align="center" variant="overline">
				Your turn for:
			</Typography>
			{error ? (
				<CustomMuiAlert severity="error" variant="outlined">
					{error}
				</CustomMuiAlert>
			) : loading ? (
				<>
					<Skeleton height={40} />
					<Skeleton height={40} />
				</>
			) : (
				<List>
					{periods &&
						(periods.length === 0 ? (
							<CustomMuiAlert severity="info" variant="outlined">
								Currently You have nothing to do{' '}
								<span role="img" aria-label="like a boss emoji">
									😎
								</span>
							</CustomMuiAlert>
						) : (
							periods.map((period) => (
								<Box
									style={{
										cursor: 'pointer',
										margin: '8px 16px',
									}}
									key={period.id}
									onClick={() =>
										history.push(`/tasks/${period.taskId}`)
									}
									flexDirection="column"
								>
									<Typography variant="subtitle1">
										{period.taskName}
									</Typography>
									<Typography variant="body1">
										<span>Start: </span>
										{period.startDate.toDateString()}
									</Typography>
									<Typography variant="body1">
										<span>End: </span>
										{period.endDate.toDateString()}
									</Typography>
									<Divider />
								</Box>
							))
						))}
				</List>
			)}
		</Box>
	);
};

export default CurrentPeriods;
