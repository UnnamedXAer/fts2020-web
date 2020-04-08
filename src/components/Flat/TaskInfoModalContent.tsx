import React from 'react';
import Task from '../../models/task';
import {
	Grid,
	Typography,
	CircularProgress,
	ListItem,
	List,
	ListItemAvatar,
	Avatar,
	ListItemText,
} from '@material-ui/core';
import moment from 'moment';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import { SupervisedUserCircle as UserCircleIcon } from '@material-ui/icons';

interface Props {
	task: Task;
	membersError: string | null;
	membersLoading: boolean;
}

const TaskInfoModalContent: React.FC<Props> = ({
	task,
	membersLoading,
	membersError,
}) => {

	let membersContent = null;
	if (!task) {
		return (
				<CircularProgress color="primary" />
		);
	}

	if (membersError) {
		membersContent = (
			<CustomMuiAlert variant="filled" severity="error">
				{membersError}
			</CustomMuiAlert>
		);
	} else if (membersLoading) {
		membersContent = <CircularProgress color="primary" />;
	} else if (!task.members || task.members.length === 0) {
		membersContent = <CustomMuiAlert variant="outlined" severity="warning">There are no members for this task.</CustomMuiAlert>;
	} else {
		membersContent = (
			<List>
				{task.members.map((member) => {
					return (
						<ListItem button key={member.id}>
							<ListItemAvatar>
								<Avatar src={member.avatarUrl}>
									<UserCircleIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={member.emailAddress}
								secondary={member.userName}
							/>
						</ListItem>
					);
				})}
			</List>
		);
	}

	return (
			<Grid container direction="column" spacing={1}>
				<Grid item>
					<Typography
						variant="h3"
						component="h2"
						id="modal-task-title-id"
					>
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
				<Grid item>
					<Typography variant="h6">Members</Typography>
					{membersContent}
				</Grid>
			</Grid>
	);
};

export default TaskInfoModalContent;
