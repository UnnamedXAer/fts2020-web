import React from 'react';
import { makeStyles, Theme, createStyles, FabTypeMap } from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { OverrideProps } from '@material-ui/core/OverridableComponent';

export type SpeedDialAction<T = number> = {
	key: T;
	name: string;
	icon: JSX.Element;
};

interface Props {
	open: boolean;
	hidden?: boolean;
	toggleOpen: () => void;
	onOptionClick: (optionName: SpeedDialAction['key']) => void;
	disabled?: boolean;
	actions: SpeedDialAction[];
}

const CustomSpeedDial: React.FC<Props> = (props) => {
	const classes = useStyles();
	const disabled = props.disabled === true;

	const fabProps: Partial<OverrideProps<
		FabTypeMap<{}, 'button'>,
		'button'
	>> = {
		color: 'secondary',
		disabled,
	};

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
			FabProps={fabProps}
		>
			{props.actions.map((action) => (
				<SpeedDialAction
					FabProps={fabProps}
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

export default CustomSpeedDial;
