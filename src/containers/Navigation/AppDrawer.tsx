import React from 'react';
import {
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Theme,
	createStyles,
	Typography,
} from '@material-ui/core';
import {
	HomeWorkOutlined as HomeIcon,
	ListAltRounded as TasksIcon,
	ContactMailRounded as InvitationsIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import CurrentPeriods from '../../components/Navigation/CurrentPeriods';

const useStyles = makeStyles<Theme, { drawerWidth: number }>((theme: Theme) =>
	createStyles({
		drawer: {
			width: (props) => props.drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: (props) => props.drawerWidth,
		},
		toolbar: theme.mixins.toolbar,
		logoContainer: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			height: '100%',
		},
		logoText: {
			fontSize: theme.spacing(3),
			fontWeight: 'bold',
			background: `linear-gradient(153deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 61%)`,
			color: 'transparent',
			backgroundClip: 'text',
			'-webkit-background-clip': 'text',
		},
	})
);

interface Props {
	drawerWidth: number;
}

const AppDrawer: React.FC<Props> = (props) => {
	const classes = useStyles({ drawerWidth: props.drawerWidth });
	const history = useHistory();

	return (
		<Drawer
			className={classes.drawer}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper,
			}}
			anchor="left"
		>
			<div className={classes.toolbar}>
				<div className={classes.logoContainer}>
					<Typography className={classes.logoText}>
						FTS 2020
					</Typography>
				</div>
			</div>
			<Divider />
			<List>
				<ListItem button onClick={() => history.push('/flats')}>
					<ListItemIcon>
						<HomeIcon color="primary" />
					</ListItemIcon>
					<ListItemText primary="Flats" />
				</ListItem>
				<ListItem button onClick={() => history.push('/my-tasks')}>
					<ListItemIcon>
						<TasksIcon color="primary" />
					</ListItemIcon>
					<ListItemText primary="Tasks" />
				</ListItem>
				<ListItem
					button
					onClick={() => history.push('/my-invitations')}
				>
					<ListItemIcon>
						<InvitationsIcon color="primary" />
					</ListItemIcon>
					<ListItemText primary="Invitations" />
				</ListItem>
			</List>
			<Divider
				style={{
					width: '90%',
					marginLeft: 'auto',
					marginRight: 'auto',
				}}
			/>
			<CurrentPeriods />
		</Drawer>
	);
};

export default AppDrawer;
