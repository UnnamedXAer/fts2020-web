import React, { useState } from 'react';
import {
	Typography,
	TextField,
	Grid,
	Avatar,
	Paper,
	Box,
	makeStyles,
	Button,
	Container,
	Theme,
	Link,
	IconButton,
	Slide
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyle = makeStyles((theme: Theme) => ({
	container: {
		height: '100vh',

		display: 'flex',
		justifyContent: 'stretch',
		alignItems: 'center'
	},
	paper: {
		width: '100%',
		padding: 30
	},
	header: {
		paddingBottom: theme.spacing(2)
	},
	avatarBox: {
		position: 'relative',
		width: theme.spacing(12),
		height: theme.spacing(12)
	},
	avatar: {
		width: '100%',
		height: '100%'
	},
	avatarCamera: {
		position: 'absolute',
		bottom: -10,
		right: -10,
		background: 'white'
	}
}));

const SignIn = () => {
	const classes = useStyle();

	const [avatarUrl, setAvatarUrl] = useState(
		'https://lh3.googleusercontent.com/-_XU_M6CM4qI/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nA0jBNgRe6Wq9N0M6Ebhz71nSfTWQ/s48-c/photo.jpg'
	); /* to do: ability to take a picture from laptop camera read more at : http://www.danielmayor.com/take-photo-with-html5-javascript */
	const [name, setName] = useState('');
	const [emailAddress, setEmailAddress] = useState('test@test.com');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [isSignIn, setIsSignIn] = useState(false);

	return (
		<Container maxWidth="sm" className={classes.container}>
			<Paper className={classes.paper} elevation={5}>
				<Box className={classes.header}>
					<Typography variant="h3" align="center">
						Sign Up
					</Typography>
				</Box>
				<form>
					<Grid
						container
						direction="column"
						alignItems="stretch"
						justify="center"
						spacing={3}
					>
						<Box justifyContent="center" display="flex">
							<Box
								className={classes.avatarBox}
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<Avatar
									alt="user avatar"
									src={avatarUrl}
									className={classes.avatar}
								/>
								<IconButton
									className={classes.avatarCamera}
									color="primary"
									aria-label="upload picture"
									component="span"
								>
									<PhotoCamera />
								</IconButton>
							</Box>
						</Box>
						<Slide
							direction="left"
							in={isSignIn}
							mountOnEnter
							unmountOnExit
						>
							<Grid item>
								<TextField
									fullWidth
									variant="outlined"
									label="Name"
									autoFocus
									required
									value={name}
								/>
							</Grid>
						</Slide>
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								label="Email Address"
								type="email"
								required
								value={emailAddress}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								label="Password"
								value={password}
								required
								type="password"
							/>
						</Grid>
						<Slide
							direction="left"
							in={isSignIn}
							mountOnEnter
							unmountOnExit
						>
							<Grid item>
								<TextField
									variant="outlined"
									fullWidth
									label="Confirm Password"
									value={passwordConfirm}
									required
									type="password"
								/>
							</Grid>
						</Slide>
						<Grid item>
							<Link
								onClick={() =>
									setIsSignIn(prevState => !prevState)
								}
								variant="body2"
								style={{ cursor: 'pointer' }}
							>
								Already have an account? Sign in
							</Link>
						</Grid>

						<Grid item>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								type="submit"
							>
								Sign Up
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default SignIn;
