import React from 'react';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function CustomMuiAlert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default CustomMuiAlert;
