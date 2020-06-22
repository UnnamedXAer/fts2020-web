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
			<div className={classes.toolbar}>FTS 2020</div>
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
