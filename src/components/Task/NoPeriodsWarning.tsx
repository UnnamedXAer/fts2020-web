import React, { useState, useRef, useEffect } from 'react';
import { Grid, Box, CircularProgress, Button } from '@material-ui/core';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import moment from 'moment';
import { Period } from '../../models/period';
import Task from '../../models/task';

const checkIfFuturePeriodsExists = (
	periods: Period[] | undefined,
	task: Task | undefined
) => {
	if (task && periods) {
		const today = moment().startOf('day').toDate();
		const isNext = periods.some((x) => x.startDate > today);
		return isNext;
	} else {
		return false;
	}
};

interface Props {
	periods: Period[] | undefined;
	task: Task | undefined;
	onSubmit: (is: number) => Promise<void>;
}

const NoPeriodsWarning = React.memo<Props>(({ periods, task, onSubmit }) => {
	const areFuturePeriods = checkIfFuturePeriodsExists(periods, task);

	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(true);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const generateHandler = async () => {
		setLoading(true);
		await onSubmit(task!.id!);
		if (isMounted.current) {
			setLoading(false);
		}
	};

	return periods && !areFuturePeriods && show ? (
		<Grid item>
			<CustomMuiAlert
				severity="warning"
				variant="outlined"
				action={
					<Box
						display="flex"
						justifyContent="flex-end"
						alignItems="center"
					>
						<Box justifySelf="flex-start" width={26} height={26}>
							{loading && (
								<CircularProgress size={26} color="primary" />
							)}
						</Box>
						<Button
							onClick={generateHandler}
							color="primary"
							disabled={loading}
						>
							Generate
						</Button>
						<Button
							onClick={() => setShow(false)}
							color="secondary"
							disabled={loading}
						>
							Later
						</Button>
					</Box>
				}
			>
				It's look like there is not future periods. Would you like to
				generate them now?
			</CustomMuiAlert>
		</Grid>
	) : null;
});

export default NoPeriodsWarning;
