import React, { useEffect, useState, useRef } from 'react';
import {
	Grid,
	Typography,
	Avatar,
	makeStyles,
	Theme,
	createStyles,
	Modal,
	Backdrop,
	Fade,
	Paper,
	TextField,
	Button,
	CircularProgress,
	Link,
	IconButton,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import User from '../../models/user';
import RootState from '../../store/storeTypes';
import { fetchUser, updateUser } from '../../store/actions/users';
import {
	EditOutlined as EditOutlinedIcon,
	CloseRounded as CloseRoundedIcon,
} from '@material-ui/icons';
import validateAuthFormField from '../../utils/authFormValidator';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';
import { StateError } from '../../ReactTypes/customReactTypes';
import HttpErrorParser from '../../utils/parseError';

interface Props extends RouteComponentProps<RouterParams> {}

type RouterParams = {
	id: string;
};

type EditableFields = 'emailAddress' | 'userName' | 'avatarUrl';

const Profile: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userId = +props.match.params.id!;
	const loggedUserId = useSelector<RootState, number>(
		(state) => state.auth.user!.id!
	);
	const user = useSelector<RootState, User | undefined>((state) =>
		state.users.users.find((x) => x.id === userId)
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [editValue, setEditValue] = useState('');
	const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState<StateError>(null);
	const [
		editedFieldName,
		setEditedFieldName,
	] = useState<EditableFields | null>(null);
	const [openEditModal, setOpenEditModal] = useState(false);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!user && !loading && error === null) {
			const loadUser = async (id: number) => {
				setLoading(true);
				setError(null);
				try {
					await dispatch(fetchUser(id));
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
				isMounted.current && setLoading(false);
			};
			loadUser(userId);
		}
	}, [dispatch, error, loading, user, userId]);

	const openFieldModificationHandler = (fieldName: EditableFields) => {
		setEditError(null);
		setOpenEditModal(true);
		setEditedFieldName(fieldName);
		setEditValue(user![fieldName!]!);
	};

	const editFieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		setEditValue(ev.target.value);
	};

	const editFieldBlurHandler: React.FocusEventHandler = async () => {
		const value = editValue.trim();

		const error = await validateAuthFormField(
			editedFieldName!,
			{ [editedFieldName!]: value },
			false
		);

		setEditError(error);
	};

	const submitFieldHandler: React.FormEventHandler = async (ev) => {
		ev.preventDefault();

		let value = editValue.trim();
		if (editedFieldName === 'emailAddress') {
			value = value.toLocaleLowerCase();
		}
		if (
			user![editedFieldName!] !== undefined &&
			user![editedFieldName!] === value
		) {
			return setOpenEditModal(false);
		}

		const error = await validateAuthFormField(
			editedFieldName!,
			{ [editedFieldName!]: value },
			false
		);

		if (error) {
			return setEditError(error);
		}

		setEditLoading(true);
		setEditError(null);
		const userData: Partial<User> = {
			[editedFieldName!]: value,
		};
		try {
			await dispatch(updateUser(userId, userData));
			setOpenEditModal(false);
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setEditError(msg);
			}
		}
		isMounted.current && setEditLoading(false);
	};

	return (
		<>
			<Grid container spacing={2} direction="column" alignItems="center">
				<Grid item>
					<Typography variant="h4" component="h1">
						Profile
					</Typography>
				</Grid>
				<Grid item>
					<IconButton
						disabled={loggedUserId !== user?.id}
						onClick={() =>
							openFieldModificationHandler('avatarUrl')
						}
					>
						<Avatar
							className={classes.avatar}
							alt="flat avatar"
							src={user?.avatarUrl}
						/>
					</IconButton>
				</Grid>
				<Grid item container direction="column">
					<Grid item>
						<Typography variant="subtitle1" color="textSecondary">
							User Name
						</Typography>
					</Grid>
					<Grid
						item
						container
						alignItems="center"
						style={{ minHeight: 36 }}
					>
						{user ? (
							<>
								<Typography
									variant="h5"
									className={classes.wordBreak}
								>
									{user!.userName}
								</Typography>
								{user.id === loggedUserId && (
									<IconButton
										className={classes.editButton}
										onClick={() =>
											openFieldModificationHandler(
												'userName'
											)
										}
									>
										<EditOutlinedIcon />
									</IconButton>
								)}
							</>
						) : (
							<Skeleton animation="wave" height={46} />
						)}
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" color="textSecondary">
							Email Address
						</Typography>
					</Grid>
					<Grid
						item
						container
						alignItems="center"
						style={{ minHeight: 36 }}
					>
						{user ? (
							<>
								<Typography
									variant="h5"
									className={classes.wordBreak}
								>
									{user!.emailAddress}
								</Typography>
								{user.id === loggedUserId && (
									<IconButton
										className={classes.editButton}
										onClick={() =>
											openFieldModificationHandler(
												'emailAddress'
											)
										}
									>
										<EditOutlinedIcon />
									</IconButton>
								)}
							</>
						) : (
							<Skeleton animation="wave" height={36} />
						)}
					</Grid>

					<Grid item>
						<Typography variant="subtitle1" color="textSecondary">
							Join Date
						</Typography>
					</Grid>
					<Grid item style={{ minHeight: 26 }}>
						{user ? (
							<Typography variant="subtitle2">
								{moment(user!.joinDate).format('llll')}
							</Typography>
						) : (
							<Skeleton animation="wave" height={36} />
						)}
					</Grid>
					{user && user.id === loggedUserId && (
						<Grid item style={{ minHeight: 26 }}>
							<Link
								component={RouterLink}
								to="/change-password"
								color="primary"
								variant="body1"
							>
								Change Password
							</Link>
						</Grid>
					)}
				</Grid>
			</Grid>
			<Modal
				aria-labelledby="edit-field-modal-title"
				className={classes.modal}
				open={openEditModal}
				onClose={() => setOpenEditModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openEditModal}>
					<Paper elevation={5} className={classes.paper}>
						<IconButton
							aria-label="Close modal"
							color="primary"
							className={classes.modalClose}
							onClick={() => setOpenEditModal(false)}
						>
							<CloseRoundedIcon />
						</IconButton>
						<form onSubmit={submitFieldHandler}>
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<Typography
										variant="h6"
										component="h2"
										id="edit-field-modal-title"
									>
										{editedFieldName === 'emailAddress'
											? 'Email Address'
											: editedFieldName === 'userName'
											? 'User Name'
											: 'Enter New Value'}
									</Typography>
								</Grid>
								<Grid item>
									<TextField
										color="primary"
										value={editValue}
										type={
											editedFieldName === 'emailAddress'
												? 'email'
												: 'text'
										}
										disabled={editLoading}
										size="medium"
										error={!!editError}
										fullWidth
										name={
											editedFieldName
												? editedFieldName
												: void 0
										}
										onChange={editFieldChangeHandler}
										onBlur={editFieldBlurHandler}
									/>
								</Grid>
								{editError && (
									<Grid item>
										<CustomMuiAlert
											severity="error"
											onClick={() => setEditError(null)}
										>
											{editError}
										</CustomMuiAlert>
									</Grid>
								)}
								<Grid item container justify="center">
									{!editLoading ? (
										<Button
											color="primary"
											type="submit"
											disabled={editLoading}
										>
											Save
										</Button>
									) : (
										<CircularProgress
											size={36}
											color="primary"
										/>
									)}
								</Grid>
							</Grid>
						</form>
					</Paper>
				</Fade>
			</Modal>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		avatar: {
			width: theme.spacing(12),
			height: theme.spacing(12),
		},
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		paper: {
			padding: theme.spacing(1, 3),
			minWidth: 250,
			maxWidth: '90vw',
			position: 'relative',
		},
		editButton: {
			opacity: 0.3,
			'&:hover': { opacity: 0.7 },
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1)
		},
		modalClose: {
			position: 'absolute',
			right: 0,
			top: 0,
		},
		wordBreak: {
			wordBreak: 'break-word',
		},
	})
);

export default Profile;
