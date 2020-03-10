import React from 'react';
import 'typeface-roboto';
import './App.css';
import SignIn from './containers/Auth/SignIn/SignIn';
import { ThemeProvider, createMuiTheme, styled } from '@material-ui/core';
import * as colors from '@material-ui/core/colors/';
import { Provider } from 'react-redux';
import store from './store/store';

const theme = createMuiTheme({
	palette: {
		primary: colors.teal,
		secondary: colors.orange
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
	}
});

const StyledApp = styled('div')({
	background: '#F8F8F8',
	minHeight: '100vh'
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<StyledApp className="App" id="AppRootComponent">
					<SignIn />
				</StyledApp>
			</Provider>
		</ThemeProvider>
	);
}

export default App;
