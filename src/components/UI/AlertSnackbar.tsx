import React from 'react';
import { Snackbar, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

type Severity = 'error' | 'success' | 'info' | 'warning' | undefined;
type CloseEventHandler = (event: React.SyntheticEvent) => void;

type AlertDialogAction = {
	label: string;
	onClick: () => void;
	color?: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
};

export type AlertSnackbarData = {
	open: boolean;
	onClose: CloseEventHandler;
	content: string;
	title?: string;
	action?: boolean | AlertDialogAction;
	severity?: Severity;
	timeout?: number;
};

interface AlertSnackbarProps {
	data: AlertSnackbarData;
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = (props) => {
	const {
		severity,
		open,
		onClose,
		content,
		title,
		action,
		timeout,
	} = props.data;

	let snackbarAction: React.ReactNode = null;
	if (action) {
		if (typeof action === 'boolean') {
			snackbarAction = <Button color="inherit">X</Button>;
		} else {
			snackbarAction = (
				<Button color={action.color} onClick={action.onClick}>
					{action.label}
				</Button>
			);
		}
	}

	return (
		<Snackbar
			open={open}
			onClose={onClose}
			autoHideDuration={timeout || 4000}
			action={snackbarAction}
		>
			<Alert onClose={onClose} severity={severity} title={title}>
				{content}
			</Alert>
		</Snackbar>
	);
};

export default AlertSnackbar;
