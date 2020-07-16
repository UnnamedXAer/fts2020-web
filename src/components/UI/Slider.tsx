import React from 'react';
import {
	makeStyles,
	createStyles,
	Theme,
	Backdrop,
	Typography,
} from '@material-ui/core';

export type SliderDataRow = {
	src: string;
	alt: string;
	description: string;
};

interface Props {
	open: boolean;
	currentPos: number;
	onClose: () => void;
	data: SliderDataRow[];
}

const Slider: React.FC<Props> = ({ open, currentPos, data, onClose }) => {
	const classes = useStyles();
	const currentImg = data[currentPos];
	return (
		<Backdrop open={open} className={classes.backdrop} onClick={onClose}>
			<div className={classes.container}>
				<img
					className={classes.image}
					src={currentImg?.src}
					alt={currentImg?.alt}
				/>
				<div>
					<Typography variant="caption">
						{currentImg?.description}
					</Typography>
				</div>
			</div>
		</Backdrop>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			padding: '5vh 5vw',
		},
		container: {
			maxWidth: '90vw',
			maxHeight: '90vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			background: theme.palette.background.paper,
		},
		image: {
			minWidth: 50,
			minHeight: 50,
			maxWidth: '95%',
			maxHeight: '95%',
			boxSizing: 'border-box',
			margin: theme.spacing(1),
			border: '1px solid #eee',
		},
	})
);

export default Slider;
