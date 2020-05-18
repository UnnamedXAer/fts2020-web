import React from 'react';
import { Period } from '../../models/period';
import moment, { Moment } from 'moment';
import PersonCellValue from './TaskSchedulePersonCellVal';
import {
	IconButton,
	CircularProgress,
	Tooltip,
	withTheme,
	Theme,
} from '@material-ui/core';
import { DoneRounded as DoneRoundedIcon } from '@material-ui/icons';

interface Props {
	period: Period;
	periodDates: { start: Moment; end: Moment };
	loading: boolean;
	onComplete: (id: number) => void;
	theme: Theme;
}

const date = moment().startOf('day').toDate();

export const TaskPeriodStatusCellVal: React.FC<Props> = ({
	period,
	periodDates,
	loading,
	onComplete,
	theme,
}) => {
	let element: JSX.Element;
	if (period.completedBy) {
		element = <PersonCellValue person={period.completedBy} />;
	} else {
		const startDateMidnight = periodDates.start.toDate();
		const periodStarted = date >= startDateMidnight;
		let color =
			periodDates.end.toDate() < date
				? theme.palette.error.main
				: startDateMidnight > date
				? theme.palette.divider
				: theme.palette.text.secondary;

		element = (
			<IconButton
				disabled={!periodStarted}
				onClick={() => onComplete(period.id)}
			>
				{loading ? (
					<CircularProgress color="primary" size={theme.spacing(3)} />
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
};

export default withTheme(TaskPeriodStatusCellVal);
