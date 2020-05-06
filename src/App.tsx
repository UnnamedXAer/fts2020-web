import React from 'react'; // , { useRef }
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
import { Provider, useSelector } from 'react-redux';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	// useHistory,
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

const StyledApp = () => {
	const classes = useStyles();
	const user = useSelector((state: RootState) => state.auth.user);

	let layout = (
		<>
			<CssBaseline />
			<AppNavBar drawerWidth={drawerWidth} title="Flats" />
			<AppDrawer drawerWidth={drawerWidth} />
			<Box className={classes.appBody}>
				<div className={classes.toolbar} />
				<Container maxWidth="md" className={classes.container}>
					<Switch>
						<Route path="/flats/add" exact component={NewFlat} />
						<Route
							path="/flats/:flatId/tasks/add"
							exact
							component={NewTask}
						/>
						<Route path="/flats/:id" component={FlatDetails} />
						<Route path="/flats" component={Flats} />
						<Route path="/tasks/:id" component={TaskDetails} />
						<Route path="/my-tasks" component={UserTasks} />
						<Route path="/profile/:id" component={Profile} />
						<Route
							path="/change-password"
							component={ChangePassword}
						/>
						<Route path="/" component={Flats} />
					</Switch>
				</Container>
			</Box>
		</>
	);

	if (user === null) {
		layout = (
			<Switch>
				<Route path="/" exact component={SignIn} />
				<Redirect to="/" />
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
