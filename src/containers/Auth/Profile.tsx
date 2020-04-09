import React, { useEffect, useState } from 'react';
import { Grid, Typography, Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import User from '../../models/user';
import RootState from '../../store/storeTypes';
import { fetchUser } from '../../store/actions/users';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const Profile: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userId = +(props.match.params as RouterParams).id!;
	const user = useSelector<RootState, User | undefined>(state => state.users.users[userId]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!user && !loading && error === null) {
			const loadUser = async  (id: number) => {
				setLoading(true);
				setError(null);
				try {
					await dispatch(fetchUser(userId))
				}
				catch (err) {
					setError(err.message);
				}
				setLoading(false);
			};
			loadUser(userId);
		}
	}, [dispatch, error, loading, user, userId]);

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography variant="h4" component="h1">
					Profile
				</Typography>
			</Grid>
			<Grid item>
				<Grid
					container
					item
					direction="row"
					spacing={4}
					alignItems="center"
				>
					<Grid item>
						<Avatar
							className={classes.avatar}
							alt="flat avatar"
							src={user?.avatarUrl}
						/>
					</Grid>
					<Grid item>
						<Typography
							variant="h5"
							component="h2"
							className={classes.title}
						>
							{user?.userName}
						</Typography>
						{user? (
							<Typography
								variant="subtitle1"
								color="textSecondary"
							>
								Created By {user!.emailAddress}
							</Typography>
						) : (
							<Skeleton animation="wave" />
						)}
						<Typography variant="subtitle1" color="textSecondary">
							{moment(user?.joinDate).format('llll')}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {},
		description: {
			paddingTop: 10,
			paddingBottom: 10,
			paddingLeft: 16,
			paddingRight: 16,
			boxSizing: 'border-box',
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
		margin: {
			margin: theme.spacing(1),
		},
		fab: {
			position: 'fixed',
			bottom: 20,
			right: 20,
		},
	})
);

export default Profile;
