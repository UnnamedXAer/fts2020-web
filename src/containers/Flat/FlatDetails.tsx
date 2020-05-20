import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
	Grid,
	Typography,
	Avatar,
	makeStyles,
	Theme,
	createStyles,
	TextField,
	Fab,
} from '@material-ui/core';
import {
	HomeWorkOutlined as HomeIcon,
	Add as AddIcon,
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import MembersList from '../../components/Flat/MembersList';
import RootState from '../../store/storeTypes';
import FlatTasks from './FlatTasks';
import { fetchFlatOwner, fetchFlatMembers } from '../../store/actions/flats';
import { StateError } from '../../ReactTypes/customReactTypes';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const FlatDetails: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const id = +(props.match.params as RouterParams).id;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	)!;

	const [loadingElements, setLoadingElements] = useState({
		owner: !!flat.owner,
		members: !!flat.members,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
	}>({
		owner: null,
		members: null,
	});

	useEffect(() => {
		if (!flat.owner && !loadingElements.owner && !elementsErrors.owner) {
			const loadOwner = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					owner: true,
				}));
				try {
					await dispatch(fetchFlatOwner(flat.ownerId, flat.id!));
				} catch (err) {
					setElementsErrors((prevState) => ({
						...prevState,
						owner: err.message,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					owner: false,
				}));
			};

			loadOwner();
		}

		if (
			!flat.members &&
			!loadingElements.members &&
			!elementsErrors.members
		) {
			const loadMembers = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					members: true,
				}));
				try {
					await dispatch(fetchFlatMembers(flat.id!));
				} catch (err) {
					setElementsErrors((prevState) => ({
						...prevState,
						members: err.message,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					members: false,
				}));
			};

			loadMembers();
		}
	}, [flat, dispatch, loadingElements, elementsErrors]);

	const memberSelectHandler = (id: number) => {
		props.history.push(`/profile/${id}`);
	};

	return (
		<>
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						View Flat
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
								src="https://vscode-icons-team.gallerycdn.vsassets.io/extensions/vscode-icons-team/vscode-icons/10.0.0/1581882255844/Microsoft.VisualStudio.Services.Icons.Default"
							>
								<HomeIcon color="primary" />
							</Avatar>
						</Grid>
						<Grid item>
							<Typography variant="h5" component="h2">
								{flat.name}
							</Typography>
							{flat.owner ? (
								<Typography
									variant="subtitle1"
									color="textSecondary"
								>
									Created By {flat.owner!.emailAddress}
								</Typography>
							) : (
								<Skeleton animation="wave" />
							)}
							<Typography
								variant="subtitle1"
								color="textSecondary"
							>
								{moment(flat.createAt).format('llll')}
							</Typography>
						</Grid>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Description
						</Typography>
						<TextField
							className={classes.description}
							value={flat.description}
							multiline
							rowsMax={4}
							fullWidth
							variant="outlined"
							inputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Members
						</Typography>
						<MembersList
							onMemberSelect={memberSelectHandler}
							loading={!flat.members}
							members={flat.members}
						/>
					</Grid>
					<Grid item>
						<Typography variant="h5" component="h3">
							Tasks
						</Typography>
						<FlatTasks flatId={flat.id as number} />
					</Grid>
				</Grid>
			</Grid>
			{flat.members && (
				<Fab
					onClick={() =>
						props.history.push(`/flats/${flat.id}/tasks/add`)
					}
					size="medium"
					color="secondary"
					aria-label="add"
					className={[classes.margin, classes.fab].join(' ')}
				>
					<AddIcon style={{ color: 'white' }} />
				</Fab>
			)}
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
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
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
);

export default FlatDetails;
