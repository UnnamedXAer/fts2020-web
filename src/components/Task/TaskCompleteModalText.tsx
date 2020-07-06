import React from 'react';
import CustomMuiAlert from '../UI/CustomMuiAlert';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import { Period } from '../../models/period';
import User from '../../models/user';

interface Props {
	loggedUserEmailAddress: User['emailAddress'];
	period: Period;
}

const TaskCompleteModalText: React.FC<Props> = ({
	loggedUserEmailAddress,
	period,
}) => {
	const isPeriodDelayed = moment(period.endDate)
		.startOf('day')
		.isBefore(moment().startOf('day'));

	const startDate = moment(period.startDate).format('dddd, Do MMMM');
	const endDate = moment(period.endDate).format('dddd, Do MMMM');
	let dateText: string;
	if (startDate === endDate) {
		dateText = startDate;
	} else {
		dateText = `${startDate} - ${endDate}`;
	}

	return (
		<>
			<Typography
				align="right"
				variant="caption"
				display="block"
				style={{ marginBlockEnd: 8 }}
			>
				Today is {moment().format('dddd, Do MMMM')}
			</Typography>
			{period.assignedTo.emailAddress !== loggedUserEmailAddress && (
				<CustomMuiAlert
					severity="warning"
					variant="outlined"
					style={{ marginBottom: 24 }}
				>
					You are about to complete period assigned to:{' '}
					<strong>
						{period.assignedTo.emailAddress} (
						{period.assignedTo.userName})
					</strong>
					<br />
					Make sure you selected the right one before confirm.
				</CustomMuiAlert>
			)}
			<Typography
				align="center"
				color={isPeriodDelayed ? 'secondary' : 'primary'}
			>
				{dateText}
			</Typography>
		</>
	);
};

export default TaskCompleteModalText;
