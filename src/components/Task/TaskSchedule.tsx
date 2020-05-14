import React, { useMemo } from 'react';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Typography,
	makeStyles,
	Theme,
	createStyles,
	withTheme,
	CircularProgress,
	IconButton,
	Box,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import { Period } from '../../models/period';
import {
	DoneAllRounded as DoneAllRoundedIcon,
	DoneRounded as DoneRoundedIcon,
} from '@material-ui/icons';

const LoadingRow = () => (
	<TableRow>
		<TableCell>
			<Skeleton animation="wave" />
		</TableCell>
		<TableCell>
			<Skeleton animation="wave" />
		</TableCell>
		<TableCell>
			<Skeleton animation="wave" />
		</TableCell>
		<TableCell>
			<Skeleton animation="wave" />
		</TableCell>
	</TableRow>
);

interface Props {
	data: Period[] | undefined;
	error: StateError;
	loading: boolean;
	periodsLoading: { [id: number]: boolean };
	loggedUserEmailAddress: string;
	onCompletePeriod: (id: number) => void;
	theme: Theme;
}

const date = new Date();

const TaskSchedule: React.FC<Props> = ({
	data,
	error,
	loading,
	periodsLoading,
	loggedUserEmailAddress,
	theme,
	onCompletePeriod,
}) => {
	const classes = useStyle();

	const getPeriodStatusIcon = useMemo(
		() => (
			period: Period,
			loading: boolean,
			onComplete: (id: number) => void
		) => {
			let element: JSX.Element;
			if (period.completedAt) {
				element = <DoneAllRoundedIcon color="primary" />;
			} else {
				let periodStarted = date >= period.startDate;
				const color =
					date <= period.endDate
						? theme.palette.text.secondary
						: theme.palette.error.main;
				element = (
					<IconButton
						disabled={!periodStarted}
						onClick={() => onComplete(period.id)}
					>
						{loading ? (
							<CircularProgress
								color="primary"
								size={theme.spacing(3)}
							/>
						) : (
							<DoneRoundedIcon
								style={{
									color,
								}}
							/>
						)}
					</IconButton>
				);
			}
			return element;
		},
		[theme]
	);

	return (
		<>
			<Table style={{ marginBottom: theme.spacing(1) }} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Assigned To</TableCell>
						<TableCell>Start Date</TableCell>
						<TableCell>End Date</TableCell>
						<TableCell>Completed By</TableCell>
						<TableCell>Completed At</TableCell>
						<TableCell>Complete</TableCell>
					</TableRow>
				</TableHead>
				{error === null && (
					<TableBody>
						{loading ? (
							<>
								<LoadingRow />
								<LoadingRow />
							</>
						) : (
							data!.map((row, i) => (
								<TableRow key={i} className={classes.row}>
									<TableCell>
										<Typography
											style={{
												color:
													loggedUserEmailAddress ===
													row.assignedTo.emailAddress
														? theme.palette
																.secondary.main
														: theme.palette.text
																.primary,
											}}
										>
											{row.assignedTo.emailAddress}
										</Typography>
										<Typography color="textSecondary">
											{row.assignedTo.userName}
										</Typography>
									</TableCell>
									<TableCell>
										{moment(row.startDate).format('llll')}
									</TableCell>
									<TableCell>
										{moment(row.endDate).format('llll')}
									</TableCell>
									<TableCell>
										<Typography>
											{row.completedBy?.emailAddress}
										</Typography>
										<Typography color="textSecondary">
											{row.completedBy?.userName}
										</Typography>
									</TableCell>
									<TableCell>
										{row.completedAt &&
											moment(row.completedAt).format(
												'llll'
											)}
									</TableCell>
									<TableCell align="center">
										{getPeriodStatusIcon(
											row,
											periodsLoading[row.id],
											onCompletePeriod
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				)}
			</Table>
			{error ? (
				<CustomMuiAlert severity="error">{error}</CustomMuiAlert>
			) : (
				data?.length === 0 && (
					<CustomMuiAlert severity="info">No records.</CustomMuiAlert>
				)
			)}
		</>
	);
};

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			'&:nth-child(odd)': { background: '#eee' },
		},
	})
);

export default withTheme(TaskSchedule);
