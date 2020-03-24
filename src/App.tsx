import React from 'react';
import 'typeface-roboto';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import * as colors from '@material-ui/core/colors/';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import store from './store/store';
import AppNavBar from './containers/Navigation/AppNavBar';
import NewFlat from './containers/Flat/NewFlat';
import SignIn from './containers/Auth/SignIn/SignIn';
import Flats from './containers/Flat/Flats';
import RootState from './store/storeTypes';

const theme = createMuiTheme({
	palette: {
		primary: colors.teal,
		secondary: colors.orange
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
	}
});

document.body.style.background = '#F8F8F8';

const StyledApp = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	let layout = (
		<AppNavBar title="Flat">
			<Router>
				<Switch>
					<Route path="/sign" component={SignIn} />
					<Route path="/flats/add" exact component={NewFlat} />
					{/* <Route path="/flats/:flatId" component={FlatDetails} /> */}
					<Route path="/flats" component={Flats} />
					<Route path="/" component={Flats} />
				</Switch>
			</Router>
		</AppNavBar>
	);

	if (user === null) {
		layout = (
			<Router>
				<Switch>
					<Route path="/" exact component={SignIn} />
					<Redirect to="/" />
				</Switch>
			</Router>
		);
	}

	return (
		<div className="App" id="AppRootComponent">
			{layout}
		</div>
	);
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<StyledApp />
			</Provider>
		</ThemeProvider>
	);
}

export default App;
