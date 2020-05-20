import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
	CircularProgress,
	TextField,
	List,
	ListItem,
	Typography,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Divider,
	makeStyles,
	Theme,
	createStyles,
	ListItemIcon,
	ListItemSecondaryAction,
	IconButton,
	Box,
} from '@material-ui/core';
import User from '../../models/user';
import axios from '../../axios/axios';
import {
	AddRounded,
	HighlightOffRounded,
	CheckRounded,
	ClearRounded,
	HelpOutlineRounded,
} from '@material-ui/icons';
import { emailAddressRegExp } from '../../utils/authFormValidator';

enum MembersState {
	'loading',
	'not_found',
	'accepted',
	'ok',
	'error',
	'invalid',
}

interface Props {
	updateMembers: (newMembers: User[]) => void;
	loggedUser: User;
	formLoading: boolean;
	updateMembersLoading: (isLoading: boolean) => void;
}

const FlatMembersSearch: React.FC<Props> = ({
	updateMembers,
	loggedUser,
	formLoading,
	updateMembersLoading,
}) => {
	const classes = useStyles();

	const [inputValue, setInputValue] = useState('');
	const [membersEmails, setMembersEmails] = React.useState<string[]>([
		loggedUser.emailAddress,
	]);
	const [members, setMembers] = React.useState<User[]>([loggedUser]);
	const [membersState, setMembersState] = useState<{
		[key: string]: MembersState;
	}>({ [loggedUser.emailAddress]: MembersState.ok });

	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		updateMembers(members);
	}, [members, updateMembers]);

	useEffect(() => {
		const membersLoading = Object.values(membersState).some(
			(x) => x === MembersState.loading
		);

		updateMembersLoading(membersLoading);
	}, [membersState, updateMembersLoading]);

	const submitMemberHandler = () => {
		const email = inputValue.trim().toLowerCase();
		if (email !== '') {
			if (!membersEmails.includes(email)) {
				submitMember(email);
			}
			// highlight row
		}
		setInputValue('');
		inputRef.current!.focus();
	};

	const submitMember = (email: string) => {
		setMembersEmails((prevSate) => prevSate.concat(email));

		const isEmailAddress = emailAddressRegExp.test(email);
		if (isEmailAddress) {
			setMembersState((prevState) => ({
				...prevState,
				[email]: MembersState.loading,
			}));
			fetchUserByEmail(email);
		} else {
			setMembersState((prevState) => ({
				...prevState,
				[email]: MembersState.invalid,
			}));
		}
	};

	const fetchUserByEmail = useCallback(async (email: string) => {
		const url = `/users/emailAddress`;
		try {
			const response = await axios.post(url, {
				emailAddress: email,
			});

			if (response.status === 204) {
				setMembersState((prevState) => ({
					...prevState,
					[email]: MembersState.not_found,
				}));
			} else {
				setMembersState((prevState) => ({
					...prevState,
					[email]: MembersState.accepted,
				}));
				setTimeout(() => {
					setMembersState((prevState) => ({
						...prevState,
						[email]: MembersState.ok,
					}));
				}, 1200);
				setMembers((prevSate) => prevSate.concat(response.data));
			}
		} catch (err) {
			setMembersState((prevState) => ({
				...prevState,
				[email]: MembersState.error,
			}));
		}
	}, []);

	const removeMemberHandler = (email: string) => {
		setMembers((prevMembers) => {
			const updatedMembers = prevMembers.filter(
				(x) => x.emailAddress.toLowerCase() !== email
			);
			return updatedMembers;
		});

		setMembersState((prevState) => {
			const updatedState = { ...prevState };
			delete updatedState[email];
			return updatedState;
		});

		setMembersEmails((prevState) => prevState.filter((x) => x !== email));
	};

	const validEmailsCount = Object.values(membersState).filter(
		(x) => x !== MembersState.invalid && x !== MembersState.loading
	).length;

	return (
		<div className={classes.container}>
			<Box width="100%">
				<Typography variant="h6">Members invitations</Typography>
			</Box>
			<Typography variant="body2">
				Add users by entering their email address. These users will
				receive an email asking them to accept the invitation. This list
				can be updated later.
			</Typography>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="flex-start"
				justifyContent="space-around"
				width="100%"
				paddingTop="10px"
			>
				<TextField
					inputRef={inputRef}
					onChange={(ev) => {
						setInputValue(ev.target.value);
					}}
					onKeyDown={(ev) => {
						if (ev.key === 'Enter') {
							submitMemberHandler();
						}
					}}
					disabled={formLoading}
					value={inputValue}
					fullWidth
					name="addMember"
					helperText="Type email address of user that you want to add as flat member."
					type="email"
					placeholder="Type email address and press enter to add"
				/>
				<IconButton
					type="submit"
					aria-label="search"
					disabled={formLoading}
					onClick={submitMemberHandler}
				>
					<AddRounded />
				</IconButton>
			</Box>

			<List className={classes.list}>
				{membersEmails.map((email, i) => {
					const member = members.find((x) => {
						return (
							x.emailAddress.toLowerCase() === email.toLowerCase()
						);
					});

					const isLoggedUser = loggedUser.id === member?.id;

					let secondaryTextColor:
						| 'initial'
						| 'inherit'
						| 'primary'
						| 'secondary'
						| 'textPrimary'
						| 'textSecondary'
						| 'error' = 'textSecondary';
					let sateIndicator: React.ReactNode;
					let secondaryText = '';
					switch (membersState[email]) {
						case MembersState.loading:
							sateIndicator = (
								<ListItemIcon className={classes.itemAvatar}>
									<CircularProgress size={25} />
								</ListItemIcon>
							);
							break;
						case MembersState.ok:
							secondaryTextColor = 'primary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<Avatar
										alt={`${member?.userName}'s avatar`}
										src={member?.avatarUrl}
									/>
								</ListItemAvatar>
							);
							secondaryText = member ? member.userName : '';
							break;
						case MembersState.accepted:
							secondaryTextColor = 'primary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<CheckRounded
										color="primary"
										fontSize="large"
									/>
								</ListItemAvatar>
							);
							secondaryText = member ? member.userName : '';
							break;
						case MembersState.invalid:
							secondaryTextColor = 'error';
							sateIndicator = (
								<ListItemAvatar
									className={classes.itemAvatar}
									style={{ height: '100%' }}
								>
									<HighlightOffRounded
										color="error"
										fontSize="large"
									/>
								</ListItemAvatar>
							);
							secondaryText =
								'Error: This is not a valid email address.';
							break;
						case MembersState.not_found:
							secondaryTextColor = 'secondary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<Avatar alt="User avatar" src="" />
								</ListItemAvatar>
							);
							secondaryText =
								'Info: Email address is not registered in FTS2020, but invitation will be sent.';
							break;
						default:
							secondaryTextColor = 'secondary';
							sateIndicator = (
								<ListItemAvatar
									className={classes.itemAvatar}
									style={{ height: '100%' }}
								>
									<HelpOutlineRounded
										color="secondary"
										fontSize="large"
									/>
								</ListItemAvatar>
							);
							secondaryText =
								'Info: Could not check if email address is registered in FTS2020 due to internal error, but invitation will be sent.';
							break;
					}
					return (
						<React.Fragment key={email}>
							<ListItem alignItems="flex-start">
								{sateIndicator}
								<ListItemText
									primary={
										isLoggedUser ? (
											<Typography color="textSecondary">
												[You] {email}
											</Typography>
										) : (
											email
										)
									}
									secondary={
										<React.Fragment>
											<Typography
												component="span"
												variant="body2"
												className={classes.inline}
											></Typography>
											<Typography
												component="span"
												color={secondaryTextColor}
											>
												{secondaryText}
											</Typography>
										</React.Fragment>
									}
								/>
								<ListItemSecondaryAction>
									{!isLoggedUser && (
										<IconButton
											edge="end"
											aria-label="delete"
											disabled={formLoading}
											onClick={() =>
												removeMemberHandler(email)
											}
										>
											<ClearRounded />
										</IconButton>
									)}
								</ListItemSecondaryAction>
							</ListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				})}
			</List>
			<p className={classes.summary}>
				{validEmailsCount === 1
					? 'Add email addresses to invite people to your flat.'
					: validEmailsCount === 2
					? 'One invitation will be sent.'
					: `${validEmailsCount - 1} invitation${
							validEmailsCount === 2 ? '' : 's'
					  } will be sent.`}
			</p>
		</div>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		list: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
			overflow: 'auto',
		},
		inline: {
			display: 'inline',
		},
		itemAvatar: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		summary: {
			color: theme.palette.info.light,
			fontStyle: 'italic',
			fontSize: 12,
			alignSelf: 'flex-end',
		},
	})
);

export default FlatMembersSearch;
