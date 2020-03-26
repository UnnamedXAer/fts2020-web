import React from 'react';
import { Paper, Typography, Box } from '@material-ui/core';
import { ErrorRounded as ErrorRoundedIcon} from '@material-ui/icons';

interface Props {
	message: string | null;
	showHeader?: boolean;
}

const ErrorCart: React.FC<Props> = ({ message, showHeader }) => {
	return (
		message !== null ? (
			<Paper elevation={4} color="error">
				<Box display="flex" flexDirection="row">
					<Box>
						{showHeader && (
							<Typography variant="h6">
								Opss, something went wrong
							</Typography>
						)}
						<Typography variant="body1">{message}</Typography>
					</Box>
					<ErrorRoundedIcon color="error"  />
				</Box>
			</Paper>
		)
		: null
	);
};

export default ErrorCart;
