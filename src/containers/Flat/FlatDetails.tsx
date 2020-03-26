import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
	Grid,
	Typography,
	Avatar,
	makeStyles,
	Theme,
	createStyles,
	TextField
} from '@material-ui/core';
import { HomeWorkOutlined as HomeIcon } from '@material-ui/icons';
import moment from 'moment';
import FlatMembers from '../../components/Flat/FlatMembers';
import RootState from '../../store/storeTypes';
import FlatTasks from './FlatTasks';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

const FlatDetails: React.FC<Props> = props => {
	const classes = useStyles();
	const id = +(props.match.params as RouterParams).id;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find(x => x.id === id)
	)!;

	return (
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
						<Typography
							variant="h5"
							component="h2"
							className={classes.title}
						>
							{flat.name}
						</Typography>
						<Typography variant="subtitle1" color="textSecondary">
							Created By {flat.owner!.emailAddress}
						</Typography>
						<Typography variant="subtitle1" color="textSecondary">
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
					<FlatMembers loading={false} members={flat.members} />
				</Grid>
				<Grid item>
					<Typography variant="h5" component="h3">
						Tasks
					</Typography>
					<FlatTasks flatId={flat.id as number} />
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
			// paddingLeft: 10,
			// paddingRight: 10
			paddingLeft: 16,
			paddingRight: 16,
			boxSizing: 'border-box'
		},
		avatar: {
			width: theme.spacing(10),
			height: theme.spacing(10)
		}
	})
);

export default FlatDetails;
