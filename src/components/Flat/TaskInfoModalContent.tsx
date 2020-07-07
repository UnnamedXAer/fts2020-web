import React, { useEffect, useRef, useState } from 'react';
import Task from '../../models/task';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import MembersList from './MembersList';
import { StateError } from '../../ReactTypes/customReactTypes';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import Skeleton from '@material-ui/lab/Skeleton';
import { fetchTaskPeriods } from '../../store/actions/periods';
import HttpErrorParser from '../../utils/parseError';

interface Props {
	task: Task;
	membersError: StateError;
	membersLoading: boolean;
	onMemberSelect: (id: number) => void;
}

const TaskInfoModalContent: React.FC<Props> = ({
	task,
	membersLoading,
	membersError,
	onMemberSelect,
}) => {
	const dispatch = useDispatch();
	const periods = useSelector(
		(state: RootState) => state.periods.taskPeriods[task.id!]
	);
	const period = periods?.find((x) => {
		const today = moment().startOf('day').toDate();
		const currentPeriod = x.startDate <= today && x.endDate >= today;

		return currentPeriod;
	});
	const [periodsError, setPeriodsError] = useState<StateError>(null);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!periods && !periodsError) {
			const loadTaskPeriods = async () => {
				setPeriodsError(null);
				try {
					await dispatch(fetchTaskPeriods(task.id!));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setPeriodsError(msg);
					}
				}
			};

			loadTaskPeriods();
		}
	}, [periodsError, dispatch, periods, task.id]);

	let membersContent = null;
	if (!task) {
		return <CircularProgress color="primary" />;
	}

	if (task.members && task.members.length === 0) {
		membersContent = (
			<CustomMuiAlert variant="outlined" severity="warning">
				There are no members for this task.
			</CustomMuiAlert>
		);
	} else {
		membersContent = (
			<MembersList
				error={membersError}
				loading={membersLoading}
				members={task.members}
				onMemberSelect={onMemberSelect}
			/>
		);
	}
	console.log(period);
	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography
					variant="h3"
					component="h2"
					id="modal-task-title-id"
				>
					{!task.active && (
						<span style={{ color: '#888' }}>[Inactive] </span>
					)}
					{task.name}
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h6">Description</Typography>
				<Typography id="modal-task-description-id">
					{task.description}
				</Typography>
			</Grid>
			<Grid item>
				<Grid container spacing={1}>
					<Grid item>
						<Typography variant="h6">Start Date</Typography>
						<Typography>
							{moment(task.startDate).format('Do MMMM YYYY')}
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="h6">End Date</Typography>
						<Typography>
							{moment(task.endDate).format('Do MMMM YYYY')}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			{task.active && (
				<Grid item>
					<Typography variant="h6">Current Period</Typography>
					{periodsError ? (
						<CustomMuiAlert severity="error">
							{periodsError}
						</CustomMuiAlert>
					) : !periods ? (
						<>
							<Skeleton height={24} width={320} />
							<Skeleton height={24} width={280} />
						</>
					) : period?.assignedTo ? (
						<>
							<Typography>
								{moment(period.startDate).format(
									'Do MMMM YYYY'
								)}{' '}
								-{' '}
								{moment(period.endDate).format('Do MMMM YYYY')}
							</Typography>
							<Typography>
								{period.assignedTo.emailAddress}
							</Typography>
							<Typography>
								{period.assignedTo.userName}
							</Typography>
							{period.completedAt && (
								<Typography variant="caption" color="primary">
									[Completed]
								</Typography>
							)}
						</>
					) : (
						<CustomMuiAlert severity="info">
							Currently there is no active period.
						</CustomMuiAlert>
					)}
				</Grid>
			)}
			<Grid item>
				<Typography variant="h6">Members</Typography>
				{membersContent}
			</Grid>
		</Grid>
	);
};

export default TaskInfoModalContent;
