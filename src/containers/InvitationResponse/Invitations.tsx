import React, { useState, useEffect, useRef } from 'react';
import {
	Grid,
	List,
	ListItem,
	Typography,
	ListItemAvatar,
	Avatar,
	ListItemText,
	makeStyles,
	Theme,
	CircularProgress,
	Box,
	Link,
	FormControlLabel,
	Checkbox,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AllInclusiveRounded as AllInclusiveRoundedIcon } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import HttpErrorParser from '../../utils/parseError';
import {
	InvitationPresentation,
	invitationInactiveStatuses,
	InvitationStatusInfo,
} from '../../models/invitation';
import { fetchUserInvitations } from '../../store/actions/invitations';
import { StateError } from '../../ReactTypes/customReactTypes';

interface Props extends RouteComponentProps {}

const Invitations: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [showInactive, setShowInactive] = useState(
		localStorage.getItem('invitations_show_inactive') === '1'
	);
	const invitations = useSelector<RootState, InvitationPresentation[]>(
		(state) =>
			showInactive
				? state.invitations.userInvitations
				: state.invitations.userInvitations.filter(
						(x) => !invitationInactiveStatuses.includes(x.status)
				  )
	);
	const userInvitationsLoadTime = useSelector<RootState, number>(
		(state) => state.invitations.userInvitationsLoadTime
	);
	const [selectedInvitation, setSelectedInvitation] = useState<string | null>(
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
		if (userInvitationsLoadTime < Date.now() - 1000 * 60 * 60 * 8) {
			setLoading(true);
			setError(null);
			const loadInvitations = async () => {
				try {
					await dispatch(fetchUserInvitations());
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
				isMounted.current && setLoading(false);
			};
			loadInvitations();
		}
	}, [dispatch, userInvitationsLoadTime]);

	const invitationClickHandler = (token: string) => {
		setSelectedInvitation(token);
	};

	const showInactiveChangeHandler = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		localStorage.setItem('invitations_show_inactive', checked ? '1' : '0');
		setShowInactive(checked);
	};

	let content = (
		<Box textAlign="center">
			<CircularProgress size={36} color="primary" />
		</Box>
	);

	if (error) {
		content = (
			<CustomMuiAlert severity="error">
				Could not load invitations due to following reason: <br />
				{error}
			</CustomMuiAlert>
		);
	} else if (!loading) {
		if (invitations.length === 0) {
			content = (
				<CustomMuiAlert severity="info">
					<span>
						You have no invitations. You can go and check your{' '}
						<Link
							className={classes.alertLink}
							color="inherit"
							title="My Flats"
							component={RouterLink}
							to="/flats"
						>
							Flats
						</Link>{' '}
						or{' '}
						<Link
							className={classes.alertLink}
							color="inherit"
							title="My Tasks."
							component={RouterLink}
							to="/my-tasks"
						>
							Tasks
						</Link>{' '}
					</span>
				</CustomMuiAlert>
			);
		} else {
			content = (
				<List dense={false} style={{ paddingTop: 0 }}>
					{invitations.map((invitation) => {
						return (
							<ListItem
								key={invitation.id}
								button
								onClick={() =>
									invitationClickHandler(invitation.token)
								}
								className={classes.listItem}
							>
								<ListItemAvatar>
									<Avatar>
										<AllInclusiveRoundedIcon color="primary" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={
										<Typography component="span">
											Flat:{' '}
											<Link
												component={RouterLink}
												to={`/flats/${invitation.flat.id}`}
												color="primary"
												variant="body1"
												title="Open flat details"
											>
												{invitation.flat.name}
											</Link>
										</Typography>
									}
									secondary={
										InvitationStatusInfo[invitation.status]
									}
								/>
							</ListItem>
						);
					})}
				</List>
			);
		}
	}

	return (
		<>
			{selectedInvitation && (
				<Redirect push to={`/invitation/${selectedInvitation}`} />
			)}
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						Your Invitations
					</Typography>
					<FormControlLabel
						control={
							<Checkbox
								checked={showInactive}
								onChange={showInactiveChangeHandler}
								name="showInactive"
								color="primary"
							/>
						}
						label="Show answered"
					/>
				</Grid>
				<Grid item style={{ paddingTop: 0 }}>
					{content}
				</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	listItem: {
		wordBreak: 'break-word',
	},
	alertLink: {
		position: 'relative',
		color: theme.palette.warning.light,

		'&:hover': {
			zIndex: 1,
			textDecoration: 'none',
			'&::before': {
				position: 'absolute',
				bottom: 0,
				left: 0,
				content: '""',
				color: 'red',
				backgroundColor: theme.palette.info.dark,
				opacity: 0.5,
				width: '100%',
				transform: 'scaleX(0)',
				height: 3,
				animation: `$myEffect 1100ms ${theme.transitions.easing.easeInOut}`,
				animationFillMode: 'forwards',
				zIndex: -1,
			},
		},
	},
	'@keyframes myEffect': {
		'0%': {
			transform: 'scaleX(0)',
			height: 3,
		},
		'40%': {
			transform: 'scaleX(1.2)',
			height: 3,
		},
		'100%': {
			height: '1.3em',
			transform: 'scaleX(1.2)',
		},
	},
}));

export default Invitations;
