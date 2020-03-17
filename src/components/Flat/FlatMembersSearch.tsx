import React, { useState } from 'react';
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
	IconButton
} from '@material-ui/core';
import User from '../../models/user';
import axios from '../../axios/axios';
import { ErrorOutline, Delete as DeleteIcon } from '@material-ui/icons';

enum MembersState {
	'loading',
	'not_fount',
	'ok',
	'error'
}

const FlatMembersSearch = () => {
	const classes = useStyles();

	const [inputValue, setInputValue] = useState('');
	const [membersEmails, setMembersEmails] = React.useState<string[]>([]);
	const [members, setMembers] = React.useState<User[]>([]);
	const [membersState, setMembersState] = useState<{
		[key: string]: MembersState;
	}>({});

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
					[value]: MembersState.ok
				}));
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

	return (
		<div>
			<TextField
				onChange={ev => {
					setInputValue(ev.target.value);
				}}
				onKeyDown={ev => {
					const value = inputValue.trim().toLowerCase();
					if (
						ev.key === 'Enter' &&
						value !== '' &&
						!membersEmails.includes(value)
					) {
						submitMember(value);
					}
				}}
				value={inputValue}
				fullWidth
				name="addMember"
				helperText="Type email address of user that you want to add to flat."
				type="email"
				placeholder="type email address and press enter to add"
			/>
			<List className={classes.root}>
				{membersEmails.map((email, i) => {
					const member = members.find(x => {
						return (
							x.emailAddress.toLowerCase() === email.toLowerCase()
						);
					});

					let color:
						| 'initial'
						| 'inherit'
						| 'primary'
						| 'secondary'
						| 'textPrimary'
						| 'textSecondary'
						| 'error';
					let sateIndicator: React.ReactNode;
					switch (membersState[email]) {
						case MembersState.loading:
							color = 'textSecondary';
							sateIndicator = (
								<ListItemIcon
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<CircularProgress size={25} />
								</ListItemIcon>
							);
							break;
						case MembersState.ok:
							color = 'textPrimary';
							sateIndicator = (
								<ListItemAvatar>
									<Avatar
										alt={`${member?.userName}'s avatar`}
										src={member?.avatarUrl}
									/>
								</ListItemAvatar>
							);

							break;
						default:
							color = 'error';
							sateIndicator = (
								<ListItemAvatar
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<ErrorOutline color="error" scale={4} />
								</ListItemAvatar>
							);
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
												// variant="body2"
												className={classes.inline}
												color={color}
											></Typography>
											{member?.userName}
										</React.Fragment>
									}
								/>
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				})}
			</List>
		</div>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			maxWidth: 360,
			backgroundColor: theme.palette.background.paper
		},
		inline: {
			display: 'inline'
		}
	})
);

export default FlatMembersSearch;
