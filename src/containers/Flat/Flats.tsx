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
	Paper
} from '@material-ui/core';
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import FlatModel from '../../models/flat';
import RootState from '../../store/storeTypes';
import { Redirect } from 'react-router-dom';

const Flats = () => {
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
		<Container>
			{selectedFlat && <Redirect push to={`/flats/${selectedFlat}`} />}
			<Paper elevation={5}>
				<Grid container spacing={2} justify="center">
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
											onClick={() =>
												flatClickHandler(flat.id!)
											}
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
				</Grid>
			</Paper>
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
	}
}));

export default Flats;
