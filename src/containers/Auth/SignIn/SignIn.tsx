import React, { useState } from 'react';
import {
	Typography,
	TextField,
	Grid,
	Avatar,
	Paper,
	Container
} from '@material-ui/core';
import classes from './SignIn.module.css';

const SignIn = () => {
	const [name, setName] = useState('initialState');
	const [emailAddress, setEmailAddress] = useState('test@test.com');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	return (
		<Container maxWidth="sm">
			<Paper>
				<Typography variant="h3" align="center">
					Sign Up
				</Typography>
				<Grid
					container
					direction="column"
					alignItems="center"
					justify="center"
					spacing={3}
				>
					<Avatar
						alt="user avatar"
						src="https://lh3.googleusercontent.com/-_XU_M6CM4qI/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nA0jBNgRe6Wq9N0M6Ebhz71nSfTWQ/s48-c/photo.jpg"
					/>

					<Grid item>
						<TextField
							variant="outlined"
							label="Name"
							value={name}
						/>
					</Grid>
					<Grid item lg={7}>
						<TextField
							fullWidth
							variant="outlined"
							label="Email Address"
							value={emailAddress}
						/>
					</Grid>
					<Grid item>
						<TextField
							variant="outlined"
							label="Password"
							value={password}
							type="password"
						/>
					</Grid>
					<Grid item>
						<TextField
							variant="outlined"
							label="Confirm Password"
							value={passwordConfirm}
							type="password"
						/>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
};

export default SignIn;
