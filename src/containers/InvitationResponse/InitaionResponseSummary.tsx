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
import {
	InvitationPresentation,
	InvitationStatus,
	InvitationAction,
} from '../../models/invitation';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlat } from '../../store/actions/flats';
import { fetchUserInvitation } from '../../store/actions/invitations';
import Skeleton from '@material-ui/lab/Skeleton';
import RootState from '../../store/storeTypes';

type RouterParams = {
	token: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const InvitationResponseSummary: FC<Props> = ({ history, match, location }) => {
	const dispatch = useDispatch();
	const token = match.params.token;
	const searchParams = new URLSearchParams(location.search);
	const action = searchParams.get('action');
	const [error, setError] = useState<StateError>(null);
	const invitation = useSelector((state: RootState) =>
		state.invitations.userInvitations.find((x) => x.token === token)
	);
	const [loading, setLoading] = useState(false);

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
			try {
				await dispatch(fetchUserInvitation(token));
			} catch (err) {
				if (isMounted.current) {
					const httpError = new HttpErrorParser(err);
					const msg = httpError.getMessage();
					setError(msg);
				}
			}
		};
		setTimeout(loadInvitation, 1300);
	}, [dispatch, error, invitation, token]);

	const submitHandler = async () => {
		if (action === InvitationAction.ACCEPT && invitation) {
			setLoading(true);
			try {
				await dispatch(fetchFlat(invitation!.flat.id!));
				history.replace(`/flats/${invitation.flat.id}`);
			} catch (err) {
				history.replace(`/flats/${invitation.flat.id}`);
				window.document.location.reload();
			}
		} else {
			history.replace('/');
		}
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

	if (!invitation && !error) {
	} else if (invitation) {
		if (action === 'autoredirect') {
			content = (
				<Grid item>
					<Typography>
						The invitation is no longer available.{' '}
						{invitation
							? `Current status is: "${invitation.status}"`
							: ''}
					</Typography>
				</Grid>
			);
		} else if (invitation && action) {
			if (
				(invitation.status === InvitationStatus.ACCEPTED &&
					action === InvitationAction.ACCEPT) ||
				(invitation.status === InvitationStatus.REJECTED &&
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
							The invitation status is already set as : "
							{invitation.status}"
						</Typography>
					) : (
						<Typography>Thank You for action.</Typography>
					)}
				</Grid>
			);
		}
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
