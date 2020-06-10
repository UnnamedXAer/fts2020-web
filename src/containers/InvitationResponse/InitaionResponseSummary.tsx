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
} from '@material-ui/core';
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';
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
	InvitationStatus,
	InvitationAction,
} from '../../models/invitation';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

type RouterParams = {
	token: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponseSummary: FC<Props> = ({ history, match, location }) => {
	const classes = useStyles();
	const token = match.params.token;
	const searchParams = new URLSearchParams(location.search);
	const status = searchParams.get('status');
	const action = searchParams.get('action');
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
		if (error || invitation) {
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
						setInvitation(invitation);
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
		setTimeout(loadInvitation, 1000);
	}, [error, invitation, token]);

	const button = invitation ? (
		<Button
			tabIndex={4}
			style={{
				paddingLeft: 40,
				paddingRight: 40,
			}}
			onClick={() =>
				history.replace(
					action === InvitationAction.ACCEPT
						? `/flats/${invitation.flat.id}`
						: `/`
				)
			}
			variant="text"
			color="primary"
			type="button"
		>
			Ok
		</Button>
	) : (
		<CircularProgress />
	);

	if (status && action) {
		if (
			(status === InvitationStatus.ACCEPTED &&
				action === InvitationAction.ACCEPT) ||
			(status === InvitationStatus.REJECTED &&
				action === InvitationAction.REJECT)
		) {
			return (
				<Grid container alignItems="center" justify="center">
					<Grid item>
						<Typography>Thank You for action.</Typography>
						{action === InvitationAction.ACCEPT && button}
					</Grid>
				</Grid>
			);
		}
	} else {
		return (
			<Grid container alignItems="center" justify="center">
				<Grid item>
					{invitation ? (
						<Typography>
							The invitation status is already set as :{' '}
							{invitation.status}
						</Typography>
					) : (
						button
					)}
				</Grid>
			</Grid>
		);
	}

	return (
		<Container maxWidth="sm">
			<Grid container spacing={2} direction="column">
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
										<Typography variant="h5" component="h2">
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
										<Typography>
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

				{error && (
					<Grid item>
						<CustomMuiAlert severity="error">
							{error}
						</CustomMuiAlert>
					</Grid>
				)}
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

export default InvitationResponseSummary;
