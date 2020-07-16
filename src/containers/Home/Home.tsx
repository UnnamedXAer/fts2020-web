import React, { useRef, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
	Grid,
	Typography,
	makeStyles,
	Theme,
	createStyles,
	Box,
	Container,
	Button,
	Paper,
	Divider,
} from '@material-ui/core';
import ZoomOutMapRoundedIcon from '@material-ui/icons/ZoomOutMapRounded';
import Slider, { SliderDataRow } from '../../components/UI/Slider';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { tryAuthorize } from '../../store/actions/auth';

interface Props extends RouteComponentProps {}

const panelsData: SliderDataRow[] = [
	{
		description: 'You can create flats',
		src: require('../../assets/images/flat_view.png'),
		alt: 'Example of flat screen',
	},
	{
		description: 'You can create tasks',
		src: require('../../assets/images/task_view.png'),
		alt: 'Example of task screen',
	},
	{
		description: 'You can track your task schedule',
		src: require('../../assets/images/schedule_view.png'),
		alt: 'Example of task schedule',
	},
];

const Home: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state: RootState) => state.auth.user);
	const [currentPos, setCurrentPos] = useState<number>(0);
	const [sliderOpen, setSliderOpen] = useState(false);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!loggedUser) {
			(async () => {
				try {
					await dispatch(tryAuthorize());
				} catch (err) {}
			})();
		}
	}, [dispatch, loggedUser]);

	const imageClickHandler = (idx: number) => {
		setCurrentPos(idx);
		setSliderOpen(true);
	};

	return (
		<Box className={classes.appBody}>
			<Container maxWidth="md" className={classes.container}>
				<Grid
					container
					spacing={2}
					direction="column"
					alignItems="stretch"
				>
					<Grid item container justify="center">
						<Typography color="primary" variant="h3" component="h1">
							Welcome to FTS2020
						</Typography>
					</Grid>
					<Grid item container justify="flex-end">
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							{/* <Typography variant="h6">
								New to FTS2020?
							</Typography> */}
							<Button
								color="secondary"
								variant="contained"
								size="large"
								onClick={() => props.history.push('/auth')}
							>
								Sign In or Sign Up
							</Button>
						</Box>
					</Grid>
					<Grid item container justify="center" direction="column">
						{panelsData.map((data, i) => (
							<Grid item className={classes.panel} key={data.src}>
								<Typography variant="h5">
									{data.description}
								</Typography>
								<Paper elevation={2} className={classes.paper}>
									<img
										className={classes.img}
										src={data.src}
										alt={data.alt}
									/>
									<div
										className={classes.paperBackdrop}
										id="paperBackdropId"
										onClick={() => imageClickHandler(i)}
									>
										<ZoomOutMapRoundedIcon fontSize="large" />
									</div>
								</Paper>
								<Divider />
							</Grid>
						))}
					</Grid>
				</Grid>
			</Container>
			<Slider
				open={sliderOpen}
				currentPos={currentPos}
				data={panelsData}
				onClose={() => setSliderOpen(false)}
			/>
		</Box>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBody: {
			flexGrow: 1,
			padding: theme.spacing(3),
		},
		container: {
			backgroundColor: 'white',
			border: '1px solid #dee2e6',
			borderRadius: 5,
			marginBottom: theme.spacing(2),
			padding: theme.spacing(3),
			flexGrow: 1,
		},
		panel: {
			padding: theme.spacing(2, 3),
			marginTop: theme.spacing(3),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			border: '1px solid ' + theme.palette.divider,
		},
		paper: {
			position: 'relative',
			'&:hover #paperBackdropId': {
				display: 'flex',
			},
		},
		paperBackdrop: {
			position: 'absolute',
			display: 'none',
			justifyContent: 'center',
			alignItems: 'center',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
			opacity: 0.3,
			cursor: 'pointer',
		},
		img: {
			maxHeight: '35vh',
		},
	})
);

export default Home;
