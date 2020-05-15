import React from 'react';
import { PeriodUser } from '../../models/period';
import {
	Tooltip,
	Typography,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core';

interface PersonCellValueProps {
	person: PeriodUser;
	markPerson?: boolean;
}

const PersonCellValue: React.FC<PersonCellValueProps> = (props) => {
	const classes = useStyle();

	return (
		<>
			<Tooltip title={props.person.emailAddress} aria-label="email">
				<Typography
					className={classes.userDataText}
					color={props.markPerson ? 'secondary' : 'textPrimary'}
				>
					{props.person.emailAddress}
				</Typography>
			</Tooltip>
			<Tooltip title={props.person.userName} aria-label="user name">
				<Typography
					color="textSecondary"
					className={classes.userDataText}
				>
					{props.person.userName}
				</Typography>
			</Tooltip>
		</>
	);
};

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		userDataText: {
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			maxWidth: 180,
			textAlign: 'initial'
		},
	})
);

export default PersonCellValue;
