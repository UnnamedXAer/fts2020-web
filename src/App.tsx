import React, { useEffect } from 'react';
import 'typeface-roboto';
import {
	ThemeProvider,
	createMuiTheme,
	makeStyles,
	Container,
	Box,
	CssBaseline,
} from '@material-ui/core';
import * as colors from '@material-ui/core/colors/';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import store from './store/store';
import AppNavBar from './containers/Navigation/AppNavBar';
import NewFlat from './containers/Flat/NewFlat';
import SignIn from './containers/Auth/SignIn/SignIn';
import Flats from './containers/Flat/Flats';
import UserTasks from './containers/Task/UserTasks';
import TaskDetails from './containers/Task/TaskDetails';
import RootState from './store/storeTypes';
import FlatDetails from './containers/Flat/FlatDetails';
import NewTask from './containers/Task/NewTask';
import Profile from './containers/Auth/Profile';
import ChangePassword from './containers/Auth/ChangePassword';
import AppDrawer from './containers/Navigation/AppDrawer';
import FlatInviteMembers from './containers/Flat/FlatInviteMembers';
import UpdateTaskMembers from './containers/Task/UpdateTaskMembers';
import InvitationResponse from './containers/InvitationResponse/InvitationResponse';
import InvitationResponseSummary from './containers/InvitationResponse/InitaionResponseSummary';
import Invitations from './containers/InvitationResponse/Invitations';
import axios from './axios/axios';
import { logOut } from './store/actions/auth';
import Home from './containers/Home/Home';

const drawerWidth = 240;

const theme = createMuiTheme({
	palette: {
		primary: colors.teal,
		secondary: colors.orange,
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	},
});

interface Props {}

const StyledApp: React.FC<Props> = () => {
	const classes = useStyles();
	const user = useSelector((state: RootState) => state.auth.user);
	const dispatch = useDispatch();

	useEffect(() => {
		const interceptorAuth = axios.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				if (
					error.response?.data.status === 401 &&
					error.response.data.no_user_logged
				) {
					await dispatch(logOut());
				}
				return Promise.reject(error);
			}
		);
		return () => {
			axios.interceptors.response.eject(interceptorAuth);
		};
	}, [dispatch]);

	let layout = (
		<>
			<CssBaseline />
			<AppNavBar drawerWidth={drawerWidth}  />
			<AppDrawer drawerWidth={drawerWidth} />
			<Box className={classes.appBody}>
				<div className={classes.toolbar} />
				<Container maxWidth="md" className={classes.container}>
					<Switch>
						<Route path="/flats/add" exact component={NewFlat} />
						<Route
							path="/flats/:id/invite-members"
							exact
							component={FlatInviteMembers}
						/>
						<Route
							path="/flats/:flatId/tasks/add"
							exact
							component={NewTask}
						/>
						<Route path="/flats/:id" component={FlatDetails} />
						<Route path="/flats" component={Flats} />
						<Route
							path="/tasks/:id/update-members"
							component={UpdateTaskMembers}
						/>
						<Route path="/tasks/:id" component={TaskDetails} />
						<Route path="/my-tasks" component={UserTasks} />
						<Route path="/profile/:id" component={Profile} />
						<Route
							path="/change-password"
							component={ChangePassword}
						/>
						<Route path="/my-invitations" component={Invitations} />
						<Route
							path="/invitation/:token/summary"
							component={InvitationResponseSummary}
						/>
						<Route
							path="/invitation/:token"
							component={InvitationResponse}
						/>
						<Redirect path="/" to="/flats" />
					</Switch>
				</Container>
			</Box>
		</>
	);

	if (user === null) {
		layout = (
			<Switch>
				<Route path="/invitation/:token" component={SignIn} />
				<Route path="/auth" component={SignIn} />
				<Route path="/" component={Home} />
				{/* <Redirect to="/" /> */}
			</Switch>
		);
	}

	return (
		<div className={classes.app} id="AppRootComponent">
			{layout}
		</div>
	);
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<Router>
					<StyledApp />
				</Router>
			</Provider>
		</ThemeProvider>
	);
}

const useStyles = makeStyles({
	app: {
		display: 'flex',
		background: '#fafafa',
		minHeight: '100vh',
	},
	appBody: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
	container: {
		backgroundColor: 'white',
		border: '1px solid #dee2e6',
		borderRadius: 5,
		marginBottom: theme.spacing(2),
		padding: theme.spacing(3),
		flexGrow: 1,
	},
	toolbar: theme.mixins.toolbar,
});

export default App;
