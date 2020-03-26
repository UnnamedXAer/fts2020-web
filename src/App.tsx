import React from 'react';
import 'typeface-roboto';
import {
	ThemeProvider,
	createMuiTheme,
	makeStyles,
	Container,
	Box
} from '@material-ui/core';
import * as colors from '@material-ui/core/colors/';
import { Provider, useSelector } from 'react-redux';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	useHistory
} from 'react-router-dom';
import store from './store/store';
import AppNavBar from './containers/Navigation/AppNavBar';
import NewFlat from './containers/Flat/NewFlat';
import SignIn from './containers/Auth/SignIn/SignIn';
import Flats from './containers/Flat/Flats';
import RootState from './store/storeTypes';
import FlatDetails from './containers/Flat/FlatDetails';

const theme = createMuiTheme({
	palette: {
		primary: colors.teal,
		secondary: colors.orange
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
	}
});

const StyledApp = () => {
	const classes = useStyles();
	const user = useSelector((state: RootState) => state.auth.user);

	let layout = (
		<>
			<AppNavBar title="Flats" />
			<Box className={classes.appBody}>
				<Container maxWidth="md" className={classes.container}>
					<Switch>
						<Route path="/flats/add" exact component={NewFlat} />
						<Route path="/flats/:id" component={FlatDetails} />
						<Route path="/flats" component={Flats} />
						<Route path="/" component={Flats} />
						{/* <Redirect from="/" to="/flats" /> */}
					</Switch>
				</Container>
			</Box>
		</>
	);

	// if (user === null) {
	// 	layout = (
	// 		<Switch>
	// 			<Route path="/" exact component={SignIn} />
	// 			<Redirect to="/" />
	// 		</Switch>
	// 	);
	// }

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
		width: '100vw',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
		margin: 0,
		padding: 0,
		overflow: 'hidden',
		background: '#fafafa'
	},
	appBody: {
		flex: 1,
		width: '100vw',
		overflow: 'auto'
	},
	container: {
		backgroundColor: 'white',
		border: '1px solid #dee2e6',
		borderRadius: 5,
		marginTop: 20,
		marginBottom: 20,
		padding: 24,
		flexGrow: 1
	}
});

export default App;
