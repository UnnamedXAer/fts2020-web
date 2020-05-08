import React from 'react';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import Task from '../../models/task';

interface Props {
	task: Task | undefined;
}

const TaskInfoTable: React.FC<Props> = ({ task }) => {
	return (
		<Table style={{ marginBottom: '8px' }}>
			<TableHead>
				<TableRow>
					<TableCell>Start date</TableCell>
					<TableCell>End date</TableCell>
					<TableCell>Period Time</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				<TableRow>
					<TableCell>
						{task ? (
							moment(task.startDate).format('llll')
						) : (
							<Skeleton animation="wave" />
						)}
					</TableCell>
					<TableCell>
						{task ? (
							moment(task.endDate).format('llll')
						) : (
							<Skeleton animation="wave" />
						)}
					</TableCell>
					<TableCell>
						{task ? (
							task.timePeriodValue +
							' ' +
							task.timePeriodUnit!.toLocaleLowerCase() +
							(task.timePeriodValue! > 1 ? 's' : '')
						) : (
							<Skeleton animation="wave" />
						)}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};

export default TaskInfoTable;
