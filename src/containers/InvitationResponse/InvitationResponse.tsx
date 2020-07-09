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
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';
import HomeIcon from '@material-ui/icons/HomeWorkOutlined';
import { RouteComponentProps } from 'react-router-dom';
import HttpErrorParser from '../../utils/parseError';
import { StateError } from '../../ReactTypes/customReactTypes';
import axios from '../../axios/axios';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import {
	InvitationPresentation,
	APIInvitationPresentation,
	InvitationStatusInfo,
	InvitationAction,
	invitationInactiveStatuses,
} from '../../models/invitation';
import { APIInvitation } from '../../store/actions/flats';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

type RouterParams = {
	token: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponse: FC<Props> = ({ history, match, location }) => {
	const classes = useStyles();
	const token = match.params.token;
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
						const notActionable = invitationInactiveStatuses.includes(
							invitation.status
						);
						if (notActionable) {
							history.replace(
								`/invitation/${token}/summary?status=${invitation.status}&action=autoredirect`
							);
						} else {
							setInvitation(invitation);
						}
					}
				}
			} catch (err) {
				if (isMounted.current) {
					const httpError = new HttpErrorParser(err);
					const msg = httpError.getMessage();
					setError(msg);
				}
			}
		};
		loadInvitation();
	}, [error, history, invitation, loading, token]);

	const actionHandler = async (
		action: InvitationAction.ACCEPT | InvitationAction.REJECT
	) => {
		setLoading(true);
		const url = `/invitations/${invitation!.id}`;
		try {
			const { data } = await axios.patch<APIInvitation>(url, {
				action: action,
			});
			if (isMounted.current) {
				history.replace(
					`/invitation/${token}/summary?${location.search}&status=${data.status}&action=${action}`
				);
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setError(msg);
			}
		}
		if (isMounted.current) {
			setLoading(false);
		}
	};

	const actionsDisabled = !invitation || loading;

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
					<Paper variant="outlined" className={classes.paper}>
						{invitation ? (
							<Typography className={classes.wordBreak}>
								You were invited by{' '}
								{invitation.sender.emailAddress}{' '}
								{`(${invitation.sender.userName})`} to join to a
								flat.
							</Typography>
						) : (
							<Skeleton height={32} />
						)}
					</Paper>
				</Grid>
				{/* invitation info */}
				<Grid item>
					<Paper
						variant="outlined"
						className={[classes.paper, classes.paperWithLabel].join(
							' '
						)}
					>
						<Typography
							className={classes.paperLabel}
							color="textSecondary"
							variant="caption"
						>
							Invitation Informations
						</Typography>
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
									<ContactMailRoundedIcon
										fontSize="large"
										color="primary"
									/>
								</Avatar>
							</Grid>
							<Grid item style={{ flex: 1 }}>
								{invitation ? (
									<>
										<Typography
											variant="h5"
											component="h2"
											className={classes.wordBreak}
										>
											{typeof invitation.invitedPerson ===
											'string'
												? invitation.invitedPerson
												: invitation.invitedPerson
														.emailAddress}
										</Typography>
										<Typography>
											<span className={classes.infoLabel}>
												{invitation.sendDate
													? 'Send'
													: 'Created'}{' '}
												at{' '}
											</span>
											{moment(
												invitation.sendDate
													? invitation.sendDate
													: invitation.createAt
											).format('LLLL')}
										</Typography>
										<Typography
											className={classes.wordBreak}
										>
											<span>Invited by </span>
											{invitation.sender!.emailAddress} (
											{invitation.sender!.userName})
										</Typography>
										<Typography>
											<span>Status: </span>
											{
												InvitationStatusInfo[
													invitation.status
												]
											}
										</Typography>
									</>
								) : (
									<>
										<Skeleton height={40} width="75%" />
										<Skeleton height={24} width="66%" />
										<Skeleton height={24} width="90%" />
										<Skeleton height={24} width="70%" />
									</>
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				{/* flat info */}
				<Grid item>
					<Paper
						variant="outlined"
						className={[classes.paper, classes.paperWithLabel].join(
							' '
						)}
					>
						<Typography
							className={classes.paperLabel}
							color="textSecondary"
							variant="caption"
						>
							Flat Informations
						</Typography>
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
									<HomeIcon
										fontSize="large"
										color="primary"
									/>
								</Avatar>
							</Grid>
							<Grid item style={{ flex: 1 }}>
								{invitation ? (
									<>
										<Typography
											variant="h5"
											component="h2"
											className={classes.wordBreak}
										>
											{invitation.flat.name}
										</Typography>
										<Typography>
											{moment(
												invitation.flat.createAt
											).format('LLLL')}
										</Typography>
										<Typography
											className={classes.wordBreak}
										>
											{
												invitation.flat.owner!
													.emailAddress
											}{' '}
											({invitation.flat.owner!.userName})
										</Typography>
									</>
								) : (
									<>
										<Skeleton height={40} width="75%" />
										<Skeleton height={24} width="66%" />
										<Skeleton height={24} width="90%" />
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
									<Typography className={classes.wordBreak}>
										{invitation.flat.description}
									</Typography>
								) : (
									<>
										<Skeleton height={24} />
										<Skeleton height={24} />
										<Skeleton height={24} width="68%" />
									</>
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				{error && (
					<Grid item>
						<CustomMuiAlert severity="error">
							{error}
						</CustomMuiAlert>
					</Grid>
				)}
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
									onClick={() =>
										actionHandler(InvitationAction.REJECT)
									}
									variant="text"
									color="primary"
									type="button"
									disabled={actionsDisabled}
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
										actionHandler(InvitationAction.ACCEPT)
									}
									variant="contained"
									color="primary"
									type="submit"
									disabled={actionsDisabled}
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
		paper: {
			padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
			flex: 1,
		},
		paperWithLabel: {
			paddingTop: 32,
			position: 'relative',
		},
		paperLabel: {
			position: 'absolute',
			top: -17,
			left: 16,
			backgroundColor: 'white',
			fontSize: 19,
			paddingRight: 8,
			paddingLeft: 8,
			fontVariant: 'all-small-caps',
		},
		infoLabel: {
			color: theme.palette.grey[600],
		},
		wordBreak: {
			wordBreak: 'break-word',
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
