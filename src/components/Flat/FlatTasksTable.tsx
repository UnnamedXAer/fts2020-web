import React from 'react';
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableBody,
	makeStyles,
	Checkbox,
	Theme,
	IconButton,
} from '@material-ui/core';
import moment from 'moment';
import { StyledTableCell, StyledTableRow } from '../UI/Table';
import Task from '../../models/task';
import {
	InfoOutlined as InfoOutlinedIcon,
} from '@material-ui/icons';

interface Props {
	tasks: Task[];
	onTaskSelected: (id: number) => void;
}

const FlatTasksTable: React.FC<Props> = ({
	tasks,
	onTaskSelected,
}) => {
	const classes = useStyles();

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="flat tasks">
				<TableHead>
					<TableRow>
						<StyledTableCell>Title</StyledTableCell>
						<StyledTableCell align="right">
							Start Date
						</StyledTableCell>
						<StyledTableCell align="right">
							End Date
						</StyledTableCell>
						<StyledTableCell align="right">
							Task Time Period
						</StyledTableCell>
						<StyledTableCell align="right">Active</StyledTableCell>
						<StyledTableCell align="right">
							Actions
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tasks.map((task) => (
						<StyledTableRow key={task.id} hover>
							<StyledTableCell component="th" scope="row">
								{task.name}
							</StyledTableCell>
							<StyledTableCell align="right">
								{moment(task.startDate).format('Do MMMM YYYY')}
							</StyledTableCell>
							<StyledTableCell align="right">
								{moment(task.endDate).format('Do MMMM YYYY')}
							</StyledTableCell>
							<StyledTableCell align="right">
								{task.timePeriodValue} {task.timePeriodUnit}
							</StyledTableCell>
							<StyledTableCell align="right">
								<Checkbox
									checked={task.active}
									disableFocusRipple
									disableRipple
									disableTouchRipple
									inputProps={{
										'aria-label': 'task active state',
										readOnly: true,
									}}
								/>
							</StyledTableCell>
							<StyledTableCell align="right">
								<IconButton
									title="Task quick info"
									onClick={() => onTaskSelected(task.id!)}
								>
									<InfoOutlinedIcon />
								</IconButton>
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		minWidth: 550,
	},
}));

export default FlatTasksTable;
