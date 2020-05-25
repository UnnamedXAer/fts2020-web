import React from 'react';
import {
	Modal,
	Backdrop,
	Fade,
	Container,
	Box,
	IconButton,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core';
import { CloseRounded as CloseRoundedIcon } from '@material-ui/icons';

interface Props {
	open: boolean;
	onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
	onCloseIconClick?: () => void;
	children: React.ReactNode;
}

const CustomModal: React.FC<Props> = (props) => {
	const classes = useStyles();

	return (
		<Modal
			aria-label="modal-panel"
			className={classes.modal}
			open={props.open}
			onClose={props.onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={props.open} unmountOnExit mountOnEnter>
				<Container className={classes.modalContent} maxWidth="md">
					{props.onCloseIconClick && (
						<Box className={classes.modalCloseBox}>
							<IconButton
								onClick={props.onCloseIconClick}
								aria-label="close-modal-panel"
							>
								<CloseRoundedIcon />
							</IconButton>
						</Box>
					)}
					{props.children}
				</Container>
			</Fade>
		</Modal>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		modalContent: {
			backgroundColor: theme.palette.background.paper,
			border: '2px solid #000',
			boxShadow: theme.shadows[5],
			padding: theme.spacing(0, 4, 3),
			maxHeight: '90vh',
			overflowX: 'hidden',
			overflowY: 'auto',
			boxSizing: 'border-box',
		},
		modalCloseBox: {
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			width: '100%',
			position: 'sticky',
			top: 0,
			backgroundColor: theme.palette.background.paper,
			padding: theme.spacing(1, 0, 0, 0),
		},
	})
);

export default CustomModal;
