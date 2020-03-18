import React, { useState, useRef, useEffect } from 'react';
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
	Box
} from '@material-ui/core';
import User from '../../models/user';
import axios from '../../axios/axios';
import {
	AddRounded,
	HighlightOffRounded,
	CheckRounded,
	ClearRounded
} from '@material-ui/icons';

enum MembersState {
	'loading',
	'not_fount',
	'accepted',
	'ok',
	'error'
}

interface Props {
	updateMembers: (newMembers: number[]) => void;
}

const FlatMembersSearch: React.FC<Props> = ({ updateMembers }) => {
	const classes = useStyles();

	const [inputValue, setInputValue] = useState('');
	const [membersEmails, setMembersEmails] = React.useState<string[]>([]);
	const [members, setMembers] = React.useState<User[]>([]);
	const [membersState, setMembersState] = useState<{
		[key: string]: MembersState;
	}>({});

	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		updateMembers(members.map(x => x.id));
		console.log('pushing members');
	}, [members, updateMembers]);

	const submitMemberHandler = () => {
		const value = inputValue.trim().toLowerCase();
		if (value !== '' && !membersEmails.includes(value)) {
			submitMember(value);
		}
		setInputValue('');
		inputRef.current!.focus();
	};

	const submitMember = (value: string) => {
		setMembersEmails(prevSate => prevSate.concat(value));
		setMembersState(prevState => ({
			...prevState,
			[value]: MembersState.loading
		}));

		setTimeout(() => fetchUserByEmail(value), 1000);
	};

	const fetchUserByEmail = async (value: string) => {
		const url = `/users/emailAddress`;
		try {
			const response = await axios.post(url, {
				emailAddress: value
			});

			if (response.status === 204) {
				setMembersState(prevState => ({
					...prevState,
					[value]: MembersState.not_fount
				}));
			} else {
				setMembersState(prevState => ({
					...prevState,
					[value]: MembersState.accepted
				}));
				setTimeout(() => {
					setMembersState(prevState => ({
						...prevState,
						[value]: MembersState.ok
					}));
				}, 1200);
				setMembers(prevSate => prevSate.concat(response.data));
			}
		} catch (err) {
			setMembersState(prevState => ({
				...prevState,
				[value]: MembersState.error
			}));
			console.log('fetch user,err: ', err);
		}
	};

	const removeMemberHandler = (email: string) => {
		setMembers(prevMembers => {
			const updatedMembers = prevMembers.filter(
				x => x.emailAddress.toLowerCase() !== email
			);
			return updatedMembers;
		});

		setMembersState(prevState => {
			const updatedState = { ...prevState };
			delete updatedState[email];
			return updatedState;
		});

		setMembersEmails(prevState => prevState.filter(x => x !== email));
	};

	return (
		<div className={classes.container}>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="flex-start"
				justifyContent="space-around"
				width="100%"
			>
				<TextField
					inputRef={inputRef}
					onChange={ev => {
						setInputValue(ev.target.value);
					}}
					onKeyDown={ev => {
						if (ev.key === 'Enter') {
							submitMemberHandler();
						}
					}}
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
					onClick={submitMemberHandler}
				>
					<AddRounded />
				</IconButton>
			</Box>

			<List className={classes.list}>
				{membersEmails.map((email, i) => {
					const member = members.find(x => {
						return (
							x.emailAddress.toLowerCase() === email.toLowerCase()
						);
					});

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
						default:
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
							secondaryText = 'Email address not found.';
							break;
					}

					return (
						<React.Fragment key={email}>
							<ListItem alignItems="flex-start">
								{sateIndicator}
								<ListItemText
									primary={email}
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
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() =>
											removeMemberHandler(email)
										}
									>
										<ClearRounded />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				})}
			</List>
			<p className={classes.summary}>
				{members.length === 0
					? 'No members added'
					: `${members.length} ${
							members.length === 1
								? 'user will be added as member'
								: 'users will be added as members'
					  }`}
				.
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
			alignItems: 'center'
		},
		list: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
			overflow: 'auto'
		},
		inline: {
			display: 'inline'
		},
		itemAvatar: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		summary: {
			color: theme.palette.info.light,
			fontStyle: 'italic',
			fontSize: 12,
			alignSelf: 'flex-end'
		}
	})
);

export default FlatMembersSearch;
