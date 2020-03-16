import React from 'react';
import {
	Container,
	Grid,
	List,
	ListItem,
	Typography,
	ListItemSecondaryAction,
	IconButton,
	ListItemAvatar,
	Avatar,
	ListItemText,
	makeStyles,
	Theme,
	ButtonBase
} from '@material-ui/core';
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import FlatModel from '../../models/flat';
import RootState from '../../store/storeTypes';

const Flat = () => {
	const classes = useStyles();
	const flats = useSelector<RootState, FlatModel[]>(
		state => state.flats.flats
	);

	const flatClickHandler = (flatId: number) => {
		console.log(flatId);
	};

	return (
		<Container>
			<Grid container spacing={2} justify="center">
				<Grid item xs={12} md={6}>
					<Typography variant="h6" className={classes.title}>
						Your Flats
					</Typography>
					<div className={classes.listContainer}>
						<List dense={false}>
							{flats.map(flat => (
								<ListItem key={flat.id} button onClick={() => flatClickHandler(flat.id)}>
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
			</Grid>
		</Container>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		maxWidth: 752
	},
	listContainer: {
		backgroundColor: theme.palette.background.paper
	},
	title: {
		margin: theme.spacing(4, 0, 2)
	},
}));

export default Flat;
