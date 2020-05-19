import React from 'react';
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
} from '@material-ui/core';
import moment from 'moment';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import { Period } from '../../models/period';
import PersonCellValue from './TaskSchedulePersonCellVal';
import TaskPeriodStatusCellVal from './TaskPeriodStatusCellVal';
import { LoadingTableRows } from '../UI/LoadingTableRows';

interface Props {
	data: Period[] | undefined;
	error: StateError;
	loading: boolean;
	periodsLoading: { [id: number]: boolean };
	loggedUserEmailAddress: string;
	onCompletePeriod: (id: number) => void;
	theme: Theme;
	disabled: boolean;
}

const TaskSchedule: React.FC<Props> = ({
	data,
	error,
	loading,
	periodsLoading,
	loggedUserEmailAddress,
	theme,
	disabled,
	onCompletePeriod,
}) => {
	const classes = useStyle();

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
							<LoadingTableRows rowsNumber={2} colsNumber={5} />
						) : (
							data!.map((row, i) => {
								const startDateMidnight = moment(
									row.startDate
								).startOf('day');
								const endDateMidnight = moment(
									row.endDate
								).startOf('day');
								return (
									<TableRow
										key={i}
										className={classes.row}
										style={
											loggedUserEmailAddress ===
											row.assignedTo.emailAddress
												? {
														borderLeftColor:
															theme.palette
																.secondary
																.light,
												  }
												: {}
										}
									>
										<TableCell
											style={{ position: 'relative' }}
										>
											{loggedUserEmailAddress ===
												row.assignedTo.emailAddress && (
												<span
													className={classes.mark}
												/>
											)}
											<PersonCellValue
												person={row.assignedTo}
											/>
										</TableCell>
										<TableCell>
											{startDateMidnight.format(
												'dddd, Do MMMM'
											)}
										</TableCell>
										<TableCell>
											{endDateMidnight.format('ll')}
										</TableCell>
										<TableCell align="center">
											<TaskPeriodStatusCellVal
												disabled={disabled}
												period={row}
												loading={periodsLoading[row.id]}
												onComplete={onCompletePeriod}
												periodDates={{
													start: startDateMidnight,
													end: endDateMidnight,
												}}
											/>
										</TableCell>
										<TableCell>
											{row.completedAt &&
												moment(row.completedAt).format(
													'll'
												)}
										</TableCell>
									</TableRow>
								);
							})
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
			borderLeft: '3px solid #ccc',
			'&:nth-child(odd)': { background: '#eee' },
		},
		mark: {
			position: 'absolute',
			left: 0,
			top: 0,
			width: 0,
			height: 0,
			borderTop: '13px solid ' + theme.palette.secondary.light,
			borderRight: '13px solid transparent',
		},
	})
);

export default withTheme(TaskSchedule);
