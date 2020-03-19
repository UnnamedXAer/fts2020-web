import React, { useEffect, useState } from 'react';
import { AxiosInstance } from 'axios';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from '@material-ui/core';
import HttpErrorParser from '../utils/parseError';


// const WithAxiosError = <P extends {}>(
// 	WrappedComponent: React.ComponentType<P>,
// 	axios: AxiosInstance
// ) => {

// 	return class extends React.Component {
// 		state: {
// 			error: null;
// 			errorCode: null;
// 		};

// 		componentWillMount() {
// 			this.reqInterceptor = axios.interceptors.request.use(req => {
// 				this.setState({ error: null });
// 				return req;
// 			});
// 			this.resInterceptor = axios.interceptors.response.use(
// 				res => res,
// 				error => {
// 					console.log(error);
// 					this.setState({ error: error });
// 				}
// 			);
// 		}

// 		componentWillUnmount() {
// 			axios.interceptors.request.eject(this.reqInterceptor);
// 			axios.interceptors.response.eject(this.resInterceptor);
// 		}
// 	};




// 	const hocComponent = ({ ...props }) => (
// 		<WrappedComponent {...(props as P)} />
// 	);

// 	const [error, setError] = useState<string | null>(null);
// 	const [errorCode, setErrorCode] = useState<number | null>(null);

// 	useEffect(() => {
// 		axios.interceptors.response.use(
// 			res => res,
// 			err => {
// 				const errorData = new HttpErrorParser(err);
// 				const errCode = errorData.getCode() || null;
// 				setError(errorData.getMessage());
// 				setErrorCode(errCode);
// 				return err;
// 			}
// 		);
// 	}, [axios.interceptors.response]);

// 	const closeHandler = () => {
// 		setError(null);
// 		setErrorCode(null);
// 	};

// 	if (error) {
// 		return (
// 			<Dialog
// 				open={!!error}
// 				onClose={closeHandler}
// 				aria-labelledby="alert-dialog-title"
// 				aria-describedby="alert-dialog-description"
// 			>
// 				<DialogTitle id="alert-dialog-title">
// 					{errorCode === 401 ? 'Unauthorized' : 'An error occurred!'}
// 					</DialogTitle>
// 				<DialogContent>
// 					<DialogContentText id="alert-dialog-description">
// 						{error}
// 					</DialogContentText>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={closeHandler} color="primary" autoFocus>
// 						Ok
// 					</Button>
// 				</DialogActions>
// 			</Dialog>
// 		);
// 	}

// 	return hocComponent;
// };

// export default WithAxiosError;
