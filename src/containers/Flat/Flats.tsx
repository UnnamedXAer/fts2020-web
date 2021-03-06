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
	Fab,
	Link,
	CircularProgress,
	Box,
	FormControlLabel,
	Checkbox,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import {
	HomeWorkOutlined as HomeIcon,
	Add as AddIcon,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import FlatModel from '../../models/flat';
import RootState from '../../store/storeTypes';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { fetchFlats } from '../../store/actions/flats';
import { StateError } from '../../ReactTypes/customReactTypes';
import { setCookiesInactiveElementsVisibility } from '../../store/actions/settings';

interface Props extends RouteComponentProps {}

const Flats: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const showInactive = useSelector(
		(state: RootState) => state.settings.showInactive.flats
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const flats = useSelector<RootState, FlatModel[]>((state) =>
		showInactive
			? state.flats.flats
			: state.flats.flats.filter((x) => x.active)
	);
	const flatsLoadTime = useSelector<RootState, number>(
		(state) => state.flats.flatsLoadTime
	);
	const [selectedFlat, setSelectedFlat] = useState<number | null>(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (flatsLoadTime < Date.now() - 1000 * 60 * 60 * 8) {
			setLoading(true);
			setError(null);
			const loadFlats = async () => {
				try {
					await dispatch(fetchFlats());
				} catch (err) {
					if (isMounted.current) {
						setError(err.message);
					}
				}
				if (isMounted.current) {
					setLoading(false);
				}
			};
			loadFlats();
		}
	}, [dispatch, flatsLoadTime]);

	const flatClickHandler = (flatId: number) => {
		setSelectedFlat(flatId);
	};

	const showInactiveChangeHandler = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		dispatch(
			setCookiesInactiveElementsVisibility('flats', void 0, checked)
		);
	};

	let content = (
		<Box textAlign="center">
			<CircularProgress size={36} color="primary" />
		</Box>
	);

	if (error) {
		content = (
			<CustomMuiAlert severity="error">
				Could not load flats due to following reason: <br />
				{error}
			</CustomMuiAlert>
		);
	} else if (!loading) {
		if (flats.length === 0) {
			content = (
				<CustomMuiAlert severity="info">
					<span>
						You are not a member of any flat.{' '}
						<Link
							className={classes.alertLink}
							color="inherit"
							title="Add a new flat."
							component={RouterLink}
							to="/flats/add"
						>
							Add
						</Link>{' '}
						your first flat or{' '}
						<Link
							className={classes.alertLink}
							color="inherit"
							title="Find a flat."
							component={RouterLink}
							to="/flats/find"
						>
							find
						</Link>{' '}
						one.
					</span>
				</CustomMuiAlert>
			);
		} else {
			content = (
				<List dense={false}>
					{flats.map((flat) => (
						<ListItem
							key={flat.id}
							button
							onClick={() => flatClickHandler(flat.id!)}
							className={classes.listItem}
						>
							<ListItemAvatar>
								<Avatar>
									<HomeIcon color="primary" />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={
									<>
										{!flat.active && (
											<span style={{ color: '#888' }}>
												[Inactive]{' '}
											</span>
										)}
										{flat.name}
									</>
								}
								secondary={flat.description}
							/>
						</ListItem>
					))}
				</List>
			);
		}
	}
	return (
		<>
			{selectedFlat && <Redirect push to={`/flats/${selectedFlat}`} />}
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Typography variant="h4" component="h1">
						Your Flats
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
						label="Show inactive"
					/>
				</Grid>
				<Grid item>{content}</Grid>
			</Grid>
			<Fab
				onClick={() => props.history.push('/flats/add')}
				size="medium"
				color="secondary"
				aria-label="add"
				className={[classes.margin, classes.fab].join(' ')}
			>
				<AddIcon style={{ color: 'white' }} />
			</Fab>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	fab: {
		position: 'fixed',
		bottom: 20,
		right: 20,
	},
	margin: {
		margin: theme.spacing(1),
	},
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

export default Flats;
