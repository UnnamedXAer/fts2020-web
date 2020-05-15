import React, { useMemo } from 'react';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	makeStyles,
	Theme,
	createStyles,
	withTheme,
	CircularProgress,
	IconButton,
	Tooltip,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import { Period } from '../../models/period';
import { DoneRounded as DoneRoundedIcon } from '@material-ui/icons';
import PersonCellValue from './TaskSchedulePersonCellVal';

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
			if (period.completedBy) {
				element = (
					<PersonCellValue
						person={period.completedBy}
						markPerson={
							loggedUserEmailAddress ===
							period.completedBy.emailAddress
						}
					/>
				);
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
							<Tooltip
								title="Complete Period"
								aria-label="Complete Period"
							>
								<DoneRoundedIcon
									style={{
										color,
									}}
								/>
							</Tooltip>
						)}
					</IconButton>
				);
			}
			return element;
		},
		[loggedUserEmailAddress, theme]
	);

	return (
		<>
			<Table className={classes.table} size="small">
				<TableHead>
					<TableRow>
						<TableCell align="center">Assigned To</TableCell>
						<TableCell align="center">Start Date</TableCell>
						<TableCell align="center">End Date</TableCell>
						<TableCell align="center">Completed By</TableCell>
						<TableCell align="center">Completed At</TableCell>
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
										<PersonCellValue
											person={row.assignedTo}
											markPerson={
												loggedUserEmailAddress ===
												row.assignedTo.emailAddress
											}
										/>
									</TableCell>
									<TableCell>
										{moment(row.startDate).format('llll')}
									</TableCell>
									<TableCell>
										{moment(row.endDate).format('llll')}
									</TableCell>
									<TableCell align="center">
										{getPeriodStatusIcon(
											row,
											periodsLoading[row.id],
											onCompletePeriod
										)}
									</TableCell>
									<TableCell>
										{row.completedAt &&
											moment(row.completedAt).format(
												'llll'
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
		table: {
			border: '1px solid #ccc',
			marginBottom: theme.spacing(1),
		},
		row: {
			'&:nth-child(odd)': { background: '#eee' },
		},
	})
);

export default withTheme(TaskSchedule);
