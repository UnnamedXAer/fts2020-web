import React, { useState, useRef, FC, useEffect } from 'react';
import {
	makeStyles,
	Theme,
	Grid,
	Typography,
	Button,
	createStyles,
	Avatar,
	Paper,
	CircularProgress,
	Box,
	Container,
	Divider,
} from '@material-ui/core';
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import { RouteComponentProps } from 'react-router-dom';
import HttpErrorParser from '../../utils/parseError';
import { StateError } from '../../ReactTypes/customReactTypes';
import axios from '../../axios/axios';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { InvitationPresentation, APIInvitationPresentation } from '../../models/invitation';

type RouterParams = {
	token: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponse: FC<Props> = ({ history, match, location }) => {
	const classes = useStyles();
	const token = match.params.token;
	const [rejected, setRejected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [invitation, setInvitation] = useState<InvitationPresentation | null>(
		null
	);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (loading || error || invitation) {
			return;
		}
		const loadInvitation = async () => {
			const url = `/invitations/${token}`;
			try {
				const { data, status } = await axios.get<
					APIInvitationPresentation
				>(url);
				if (isMounted.current) {
					if (status === 200) {
						const invitation = new InvitationPresentation(data);
						console.log(invitation);

						setInvitation(invitation);
					}
					setLoading(false);
				}
			} catch (err) {
				if (isMounted.current) {
					const httpError = new HttpErrorParser(err);
					const msg = httpError.getMessage();
					setError(msg);
				}
			}
		};
		setLoading(true);
		setTimeout(loadInvitation, 3000);
	}, [error, token, invitation, loading]);

	const rejectHandler = async () => {
		setLoading(true);
		const url = `/invitations/reject/${token}`;
		try {
			await axios.get(url);
			if (isMounted.current) {
				history.replace(`/`);
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setError(msg);
				setRejected(true);
			}
		}
	};

	if (rejected) {
		return (
			<Grid container alignItems="center" justify="center">
				<Grid item>
					<Typography>
						Thank You for action. You may close this window.
					</Typography>
				</Grid>
			</Grid>
		);
	}

	return (
		<Container maxWidth="sm">
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography
						variant="h3"
						component="h1"
						align="center"
						color="primary"
					>
						Flat Invitation
					</Typography>
				</Grid>
				<Grid item>
					<Paper
						variant="outlined"
						className={classes.descriptionPaper}
					>
						{invitation ? (
							<Typography>
								You were invited by{' '}
								{invitation.sender.emailAddress}{' '}
								{`(${invitation.sender.userName})`} to join to
								flat.
							</Typography>
						) : (
							<Skeleton height={32} />
						)}
					</Paper>
				</Grid>
				<Grid item>
					<Paper
						variant="outlined"
						className={classes.descriptionPaper}
					>
						<Grid
							container
							direction="row"
							spacing={4}
							alignItems="center"
						>
							<Grid item>
								<Avatar
									className={classes.avatar}
									alt="flat avatar"
									src=""
								>
									<HomeIcon color="primary" />
								</Avatar>
							</Grid>
							<Grid item>
								{invitation ? (
									<>
										<Typography variant="h5" component="h2">
											{invitation.flat.name}
										</Typography>
										<Typography>
											{moment(
												invitation.flat.createAt
											).format('LLLL')}
										</Typography>
										<Typography>
											{
												invitation.flat.owner!
													.emailAddress
											}{' '}
											({invitation.flat.owner!.userName})
										</Typography>
									</>
								) : (
									<>
										<Skeleton
											height={16}
											style={{ flex: 1 }}
										/>
										<Skeleton height={16} />
									</>
								)}
							</Grid>
						</Grid>
						<Divider style={{ margin: '24px 0' }} />
						<Grid container spacing={0} direction="column">
							<Grid item>
								<Typography variant="subtitle2">
									Description
								</Typography>
							</Grid>
							<Grid item>
								{invitation ? (
									<Typography>
										{invitation.flat.description}
									</Typography>
								) : (
									<Skeleton height={24} />
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item>
					<Box className={classes.actions}>
						{loading ? (
							<CircularProgress size={36} />
						) : (
							<>
								<Button
									tabIndex={4}
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									onClick={rejectHandler}
									variant="text"
									color="primary"
									type="button"
								>
									Reject
								</Button>
								<Button
									tabIndex={3}
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									onClick={() =>
										history.replace(
											`/flats/${invitation!.flat.id}`
										)
									}
									variant="contained"
									color="primary"
									type="submit"
								>
									Accept
								</Button>
							</>
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		descriptionPaper: {
			padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
			flex: 1,
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
		actions: {
			marginTop: theme.spacing(3),
			justifyContent: 'space-around',
			alignItems: 'center',
			display: 'flex',
		},
	})
);

export default InvitationResponse;
