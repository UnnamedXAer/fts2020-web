import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	DialogActions,
	Button,
	Box,
	CircularProgress,
} from '@material-ui/core';

type AlertDialogAction = {
	label: string;
	onClick: () => void;
	color?: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
	autoFocus?: boolean;
};

export type AlertDialogData = {
	open: boolean;
	onClose: () => void;
	content: React.ReactNode;
	title: string;
	actions?: AlertDialogAction[];
	loading: boolean;
};

interface AlertDialogProps {
	data: AlertDialogData;
}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
	const { open, content, title, onClose, actions, loading } = props.data;

	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			open={open}
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent dividers style={{ minWidth: 300 }}>
				<Typography
					gutterBottom
					component={typeof content === 'string' ? 'p' : 'span'}
				>
					{content}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Box justifySelf="flex-start" width={26} height={26}>
					{loading && <CircularProgress size={26} color="primary" />}
				</Box>
				{actions ? (
					actions.map((action) => (
						<Button
							disabled={loading}
							key={action.label}
							autoFocus={action.autoFocus}
							onClick={action.onClick}
							color={action.color}
						>
							{action.label}
						</Button>
					))
				) : (
					<Button
						autoFocus
						onClick={onClose}
						color="primary"
						disabled={loading}
					>
						Ok
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AlertDialog;
