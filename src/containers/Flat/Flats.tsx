import React, { useState } from 'react';
import {
	Container,
	Grid,
	List,
	ListItem,
	Typography,
	ListItemAvatar,
	Avatar,
	ListItemText,
	makeStyles,
	Theme,
	Paper,
	Fab
} from '@material-ui/core';
import {
	HomeWorkOutlined as HomeIcon,
	Add as AddIcon
} from '@material-ui/icons';
import { useSelector } from 'react-redux';
import FlatModel from '../../models/flat';
import RootState from '../../store/storeTypes';
import { Redirect, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

const Flats: React.FC<Props> = props => {
	console.log(props);
	const classes = useStyles();
	const flats = useSelector<RootState, FlatModel[]>(
		state => state.flats.flats
	);
	const [selectedFlat, setSelectedFlat] = useState<number | null>(null);

	const flatClickHandler = (flatId: number) => {
		console.log(flatId);
		setSelectedFlat(flatId);
	};

	return (
		<Grid container spacing={2} justify="center">
			{selectedFlat && <Redirect push to={`/flats/${selectedFlat}`} />}
			<Grid item xs={12} md={6}>
				<Typography variant="h6" className={classes.title}>
					Your Flats
				</Typography>
				<div className={classes.listContainer}>
					<List dense={false}>
						{flats.map(flat => (
							<ListItem
								key={flat.id}
								button
								onClick={() => flatClickHandler(flat.id!)}
							>
								<ListItemAvatar>
									<Avatar>
										<HomeIcon color="primary" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={flat.name}
									secondary={flat.description}
								/>
							</ListItem>
						))}
					</List>
				</div>
			</Grid>
			<Fab
				onClick={() => props.history.push('/flats/add')}
				size="medium"
				color="secondary"
				aria-label="add"
				className={[classes.margin, classes.fab].join(' ')}
			>
				<AddIcon />
			</Fab>
		</Grid>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	listContainer: {
		backgroundColor: theme.palette.background.paper
	},
	title: {
		margin: theme.spacing(4, 0, 2)
	},
	fab: {
		position: 'fixed',
		bottom: 20,
		right: 20
	},
	margin: {
		margin: theme.spacing(1)
	}
}));

export default Flats;
