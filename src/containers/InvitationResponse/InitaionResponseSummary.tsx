import React, { useState, useRef, FC, useEffect } from 'react';
import {
	Grid,
	Typography,
	Button,
	CircularProgress,
	Container,
} from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import HttpErrorParser from '../../utils/parseError';
import { StateError } from '../../ReactTypes/customReactTypes';
import axios from '../../axios/axios';
import {
	InvitationPresentation,
	APIInvitationPresentation,
	InvitationStatus,
	InvitationAction,
} from '../../models/invitation';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { useDispatch } from 'react-redux';
import { resetFlatsLoadTime } from '../../store/actions/flats';

type RouterParams = {
	token: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponseSummary: FC<Props> = ({ history, match, location }) => {
	const dispatch = useDispatch();
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
		loadInvitation();
	}, [error, invitation, token]);

	const submitHandler = () => {
		dispatch(resetFlatsLoadTime());
		history.replace(
			action === InvitationAction.ACCEPT && invitation
				? `/flats/${invitation.flat.id}`
				: `/`
		);
	};

	const screenAction = (
		<>
			{error ? (
				<>
					<Grid item>
						<CustomMuiAlert severity="warning">
							Could not load some data. Don't wait, you can leave
							this page.
						</CustomMuiAlert>
					</Grid>
				</>
			) : (
				!invitation && (
					<Grid item>
						<CircularProgress />
					</Grid>
				)
			)}

			<Grid item>
				<Button
					tabIndex={4}
					style={{
						paddingLeft: 40,
						paddingRight: 40,
					}}
					onClick={submitHandler}
					variant="contained"
					color="primary"
					type="button"
				>
					Ok
				</Button>
			</Grid>
		</>
	);

	let content: React.ReactNode = null;

	if (action === 'autoredirect') {
		content = (
			<Grid item>
				<Typography>
					The invitation is no longer available.{' '}
					{status || invitation
						? `Current status is: "${invitation?.status || status}"`
						: ''}
				</Typography>
			</Grid>
		);
	} else if (status && action) {
		if (
			(status === InvitationStatus.ACCEPTED &&
				action === InvitationAction.ACCEPT) ||
			(status === InvitationStatus.REJECTED &&
				action === InvitationAction.REJECT)
		) {
			content = (
				<Grid item>
					<Typography>Thank You for action.</Typography>
				</Grid>
			);
		}
	} else {
		content = (
			<Grid item>
				{invitation ? (
					<Typography>
						The invitation status is already set as :{' '}
						{invitation.status}
					</Typography>
				) : (
					<Typography>Thank You for action.</Typography>
				)}
			</Grid>
		);
	}
	return (
		<Container maxWidth="sm">
			<Grid
				spacing={2}
				container
				alignItems="center"
				justify="center"
				direction="column"
			>
				{content}
				{screenAction}
			</Grid>
		</Container>
	);
};

export default InvitationResponseSummary;
