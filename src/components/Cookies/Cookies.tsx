import React from 'react';
import {
	Typography,
	Box,
	IconButton,
	createStyles,
	makeStyles,
	Theme,
} from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

interface Props {
	visible: boolean;
	onDismiss: () => void;
}

const Cookies: React.FC<Props> = ({ visible, onDismiss }) => {
	const classes = useStyle();
	return visible ? (
		<Box className={classes.container}>
			<Typography>This site may store some data in cookies.</Typography>
			<IconButton onClick={onDismiss}>
				<CloseRoundedIcon />
			</IconButton>
		</Box>
	) : null;
};

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(0.5, 2),
			position: 'fixed',
			bottom: 0,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: theme.zIndex.drawer + 100,
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.action.active,
			boxShadow: '1px -1px 5px 0px rgba(0,0,0,0.75)',

			'& > p:first-child': {
				marginRight: theme.spacing(2),
			},
		},
	})
);

export default Cookies;
