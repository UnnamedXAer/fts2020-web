import React from 'react';
import { Paper, Typography, Box, makeStyles } from '@material-ui/core';
import { ErrorOutlineRounded as ErrorRoundedIcon } from '@material-ui/icons';

interface Props {
	message: string | null;
	headerMessage?: string;
	showHeader?: boolean;
	iconSize?: 'inherit' | 'default' | 'large' | 'small' | undefined;
}

const ErrorCart: React.FC<Props> = ({
	message,
	headerMessage = 'An error occurred',
	showHeader,
	iconSize = 'default',
}) => {
	const classes = useStyle();
	return message !== null ? (
		<Paper className={classes.cart} elevation={4} color="error">
			<Box
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
			>
				<Box>
					{showHeader && (
						<Typography variant="h6">{headerMessage}</Typography>
					)}
					<Typography variant="body1">{message}</Typography>
				</Box>
				<ErrorRoundedIcon color="error" fontSize={iconSize} />
			</Box>
		</Paper>
	) : null;
};

const useStyle = makeStyles({
	cart: {
		padding: 16,
	},
});

export default ErrorCart;
