import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import CancelPresentationRoundedIcon from '@material-ui/icons/CancelPresentationRounded';
import QueuePlayNextRoundedIcon from '@material-ui/icons/QueuePlayNextRounded';
import { TaskSpeedActions } from '../../ReactTypes/customReactTypes';

interface Props {
	open: boolean;
	hidden?: boolean;
	toggleOpen: () => void;
	onOptionClick: (optionName: TaskSpeedActions) => void;
}

const actions: {
	key: TaskSpeedActions;
	name: string;
	icon: JSX.Element;
}[] = [
	{ key: 'add-member', name: 'Add Member', icon: <PersonAddRoundedIcon /> },
	{
		key: 'close-task',
		name: 'Close Task',
		icon: <CancelPresentationRoundedIcon />,
	},
	{
		key: 'reset-periods',
		name: 'Reset Periods',
		icon: <QueuePlayNextRoundedIcon />,
	},
];

const TaskSpeedDial: React.FC<Props> = (props) => {
	const classes = useStyles();

	return (
		<SpeedDial
			ariaLabel="Task speed dial"
			className={classes.speedDial}
			hidden={props.hidden}
			icon={<SpeedDialIcon style={{ color: 'white' }} />}
			onClose={props.toggleOpen}
			onOpen={props.toggleOpen}
			open={props.open}
			color="background"
			FabProps={{
				color: 'secondary',
			}}
		>
			{actions.map((action) => (
				<SpeedDialAction
					key={action.key}
					icon={action.icon}
					tooltipTitle={action.name}
					tooltipOpen
					onClick={() => props.onOptionClick(action.key)}
				/>
			))}
		</SpeedDial>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		speedDial: {
			position: 'fixed',
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
);

export default TaskSpeedDial;
