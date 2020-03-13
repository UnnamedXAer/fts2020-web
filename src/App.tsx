import React from 'react';
import 'typeface-roboto';
// import SignIn from './containers/Auth/SignIn/SignIn';
import { ThemeProvider, createMuiTheme, styled } from '@material-ui/core';
import * as colors from '@material-ui/core/colors/';
import { Provider } from 'react-redux';
import store from './store/store';
import AppNavBar from './containers/Navigation/AppNavBar';

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

const StyledApp = styled('div')({
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<StyledApp className="App" id="AppRootComponent">
					<AppNavBar title="Flat">
					<SignIn />
					</AppNavBar>
				</StyledApp>
			</Provider>
		</ThemeProvider>
	);
}

export default App;
