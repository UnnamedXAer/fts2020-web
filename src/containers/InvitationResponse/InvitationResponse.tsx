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
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import { RouteComponentProps } from 'react-router-dom';
import { InvitationStatus } from '../../models/invitation';
import HttpErrorParser from '../../utils/parseError';
import { StateError } from '../../ReactTypes/customReactTypes';
import axios from '../../axios/axios';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import User from '../../models/user';
import { APIUser, mapApiUserDataToModel } from '../../store/actions/users';
import { APIFlat, mapAPIFlatDataToModel } from '../../store/actions/flats';
import Flat from '../../models/flat';

type APIInvitationPresentation = {
	id: number;
	status: InvitationStatus;
	sendDate: string;
	actionDate: string | null;
	createAt: string;
	sender: APIUser;
	invitedPerson: APIUser | string;
	flat: APIFlat;
};

class InvitationPresentation {
	public id: number;
	public invitedPerson: string | User;
	public sendDate: Date;
	public status: InvitationStatus;
	public actionDate: Date | null;
	public createAt: Date;
	public sender: User;
	public flat: Flat;
	constructor(data: APIInvitationPresentation) {
		this.id = data.id;
		this.invitedPerson =
			typeof data.invitedPerson === 'string'
				? data.invitedPerson
				: mapApiUserDataToModel(data.invitedPerson);
		this.status = data.status;
		this.sendDate =
			typeof data.sendDate === 'string'
				? new Date(data.sendDate)
				: data.sendDate;
		this.actionDate = data.actionDate
			? typeof data.actionDate === 'string'
				? new Date(data.actionDate)
				: data.actionDate
			: null;
		this.createAt =
			typeof data.createAt === 'string'
				? new Date(data.createAt)
				: data.createAt;
		this.sender = User.fromData({
			...data.sender,
		});
		this.flat = mapAPIFlatDataToModel(data.flat);
	}
}

type RouterParams = {
	id: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponse: FC<Props> = ({ history, match, location }) => {
	const classes = useStyles();
	const id = +match.params.id;

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
			const url = `/invitations/${id}`;
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
	}, [error, id, invitation, loading]);

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
						<Grid item >
							{invitation ? (
								<>
									<Typography variant="h5" component="h2">
										{invitation.flat.name}
									</Typography>
									<Typography>
										{moment(invitation.flat.createAt).format('LLLL')}
									</Typography>
								</>
							) : (
								<>
									<Skeleton height={16} style={{flex: 1}} />
									<Skeleton height={16} />
								</>
							)}
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Typography variant="subtitle2">Description</Typography>
					<Paper
						variant="outlined"
						className={classes.descriptionPaper}
					>
						{invitation ? (
							<Typography>
								{invitation.flat.description}
							</Typography>
						) : (
							<Skeleton height={24} />
						)}
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
									onClick={() => setRejected(true)}
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
