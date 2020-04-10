import React, { useEffect, useState } from 'react';
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
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import User from '../../models/user';
import RootState from '../../store/storeTypes';
import { fetchUser, updateUser } from '../../store/actions/users';
import { EditOutlined as EditOutlinedIcon } from '@material-ui/icons';
import validateAuthFormField from '../../utils/authFormValidator';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

interface Props extends RouteComponentProps {}

type RouterParams = {
	id: string;
};

type EditableFields = 'emailAddress' | 'userName';

const Profile: React.FC<Props> = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userId = +(props.match.params as RouterParams).id!;
	const loggedUserId = useSelector<RootState, number>(
		(state) => state.auth.user!.id!
	);
	const user = useSelector<RootState, User | undefined>(
		(state) => state.users.users[userId]
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editValue, setEditValue] = useState('');
	const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState<string | null>(null);
	const [
		editedFieldName,
		setEditedFieldName,
	] = useState<EditableFields | null>(null);
	const [openEditModal, setOpenEditModal] = useState(false);

	useEffect(() => {
		if (!user && !loading && error === null) {
			const loadUser = async (id: number) => {
				setLoading(true);
				setError(null);
				try {
					await dispatch(fetchUser(userId));
				} catch (err) {
					setError(err.message);
				}
				setLoading(false);
			};
			loadUser(userId);
		}
	}, [dispatch, error, loading, user, userId]);

	const openFieldModificationHandler = (fieldName: EditableFields) => {
		console.log(fieldName, user![fieldName]);
		setOpenEditModal(true);
		setEditedFieldName(fieldName);
		setEditValue(user![fieldName!]);
	};

	const editFieldChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
		ev
	) => {
		setEditValue(ev.target.value);
	};

	const editFieldBlurHandler: React.FocusEventHandler = () => {
		const value = editValue.trim();

		const error = validateAuthFormField(
			editedFieldName!,
			{ [editedFieldName!]: value },
			false
		);

		setEditError(error);
	};

	const submitFieldHandler: React.FormEventHandler = async (ev) => {
		ev.preventDefault();

		const value = editValue.trim();
		const error = validateAuthFormField(
			editedFieldName!,
			{ [editedFieldName!]: value },
			false
		);

		if (error) {
			return setEditError(error);
		}

		setEditLoading(true);
		setTimeout(async () => {
			const user: Partial<User> = {
				[editedFieldName!]: value,
			};
			try {
				await dispatch(updateUser(userId, user));
				setOpenEditModal(false);
			} catch (err) {
				setEditError(err.message);
			}
			setEditLoading(false);
		}, 500);
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
					<Avatar
						className={classes.avatar}
						alt="flat avatar"
						src={user?.avatarUrl}
					/>
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
						style={{ minHeight: 36 }}
						className={classes.editable}
					>
						{user ? (
							<>
								<Typography variant="h5">
									{user!.userName}
								</Typography>
								{user.id === loggedUserId && (
									<EditOutlinedIcon
										className={classes.modifyFieldIcon}
										onClick={() =>
											openFieldModificationHandler(
												'userName'
											)
										}
									/>
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
						style={{ minHeight: 36 }}
						className={classes.editable}
					>
						{user ? (
							<>
								<Typography variant="h5">
									{user!.emailAddress}
								</Typography>
								{user.id === loggedUserId && (
									<EditOutlinedIcon
										className={classes.modifyFieldIcon}
										onClick={() =>
											openFieldModificationHandler(
												'emailAddress'
											)
										}
									/>
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
		editable: {},
		modifyFieldIcon: {
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
			opacity: 0.16,
			'&:hover': {
				opacity: 0.7,
			},
		},
		avatar: {
			width: theme.spacing(12),
			height: theme.spacing(12),
		},
		fab: {
			position: 'fixed',
			bottom: 20,
			right: 20,
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
		},
	})
);

export default Profile;
