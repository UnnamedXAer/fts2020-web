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
import { TaskPeriodUnit } from '../../models/task';
import { CheckBox } from '@material-ui/icons';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';

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
	data: {}[] | undefined;
	timePeriodValue: number;
	timePeriodUnit: TaskPeriodUnit;
	error: StateError;
	loading: boolean;
}

const TaskSchedule: React.FC<Props> = ({
	data,
	timePeriodUnit,
	timePeriodValue,
	error,
	loading,
}) => {
	return (
		<>
			<Table style={{ marginBottom: '8px' }} size="small">
				<TableHead>
					<TableRow>
						<TableCell>Person</TableCell>
						<TableCell>Start date</TableCell>
						<TableCell>End date</TableCell>
						<TableCell>Done</TableCell>
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
								<TableRow key={i}>
									<TableCell>Ann</TableCell>
									<TableCell>
										{moment()
											.subtract(1, 'week')
											.format('llll')}
									</TableCell>
									<TableCell>
										{moment().format('llll')}
									</TableCell>
									<TableCell>
										<CheckBox color="primary" />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				)}
			</Table>
			{data?.length === 0 && (
				<CustomMuiAlert severity="info">No records.</CustomMuiAlert>
			)}
			{error && <CustomMuiAlert severity="error">{error}</CustomMuiAlert>}
		</>
	);
};

export default TaskSchedule;
