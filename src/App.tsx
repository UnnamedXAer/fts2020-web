import React from 'react';
import 'typeface-roboto';
import './App.css';
import SignIn from './containers/Auth/SignIn/SignIn';
import { Container } from '@material-ui/core';

function App() {
	return (
		<div className="App">
			<Container
				maxWidth="lg"
				style={{
					background: '#eee',
				}}
			>
				<SignIn />
			</Container>
		</div>
	);
}

export default App;
