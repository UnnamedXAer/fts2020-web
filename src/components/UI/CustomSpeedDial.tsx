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
	onClick: () => void;
	onClose: () => void;
	onOptionClick: (optionKey: SpeedDialAction['key']) => void;
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
			onClose={(_, reason) => {
				if (reason !== 'toggle') {
					props.onClose();
				}
			}}
			// onOpen={props.openHandler}
			onClick={props.onClick}
			open={props.open}
			color="background"
			FabProps={fabProps}
		>
			{props.actions.map((action) => {
				return (
					<SpeedDialAction
						FabProps={fabProps}
						key={action.key}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={() => props.onOptionClick(action.key)}
					/>
				);
			})}
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
