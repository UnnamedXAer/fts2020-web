import React from 'react';
import {
	List,
	ListItemIcon,
	CircularProgress,
	ListItemAvatar,
	Avatar,
	ListItem,
	ListItemText,
	Typography,
	ListItemSecondaryAction,
	IconButton,
	Divider,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core';
import {
	HighlightOffRounded,
	CheckRounded,
	ClearRounded,
	HelpOutlineRounded,
} from '@material-ui/icons';
import { APP_NAME } from '../../config/config';
import User from '../../models/user';
import { MembersStatus } from '../../containers/Flat/FlatInviteMembers';

interface Props {
	emails: User['emailAddress'][];
	loggedUser: User;
	members: Partial<User>[];
	membersStatus: {
		[key: string]: MembersStatus;
	};
	formLoading: boolean;
	onRemove: (email: string) => void;
}

type TextColor =
	| 'initial'
	| 'inherit'
	| 'primary'
	| 'secondary'
	| 'textPrimary'
	| 'textSecondary'
	| 'error';

const InvitationMembersList: React.FC<Props> = ({
	emails,
	loggedUser,
	members,
	membersStatus,
	formLoading,
	onRemove,
}) => {
	const classes = useStyles();

	const validEmailsCount = Object.values(membersStatus).filter(
		(x) =>
			x === MembersStatus.ok ||
			x === MembersStatus.error ||
			x === MembersStatus.not_found
	).length;
	return (
		<>
			<List className={classes.list}>
				{emails.map((email) => {
					const member = members.find((x) => {
						return x.emailAddress === email;
					});

					const isLoggedUser = loggedUser.id === member?.id;

					let secondaryTextColor: TextColor;
					let sateIndicator: React.ReactNode;
					let secondaryText: string;

					switch (membersStatus[email]) {
						case MembersStatus.loading:
							secondaryTextColor = 'textSecondary';
							sateIndicator = (
								<ListItemIcon className={classes.itemAvatar}>
									<CircularProgress size={25} />
								</ListItemIcon>
							);
							secondaryText = 'Loading...';
							break;
						case MembersStatus.already_member:
						case MembersStatus.ok:
							secondaryTextColor = 'primary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<Avatar
										alt={`${member?.userName}'s avatar`}
										src={member?.avatarUrl}
									/>
								</ListItemAvatar>
							);
							secondaryText = member ? member.userName! : '';
							break;
						case MembersStatus.accepted:
							secondaryTextColor = 'primary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<CheckRounded
										color="primary"
										fontSize="large"
									/>
								</ListItemAvatar>
							);
							secondaryText = member ? member.userName! : '';
							break;
						case MembersStatus.invalid:
							secondaryTextColor = 'error';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<HighlightOffRounded
										color="error"
										fontSize="large"
									/>
								</ListItemAvatar>
							);
							secondaryText =
								'Error: This is not a valid email address.';
							break;
						case MembersStatus.not_found:
							secondaryTextColor = 'secondary';
							sateIndicator = (
								<ListItemAvatar className={classes.itemAvatar}>
									<Avatar alt="User avatar" src="" />
								</ListItemAvatar>
							);
							secondaryText =
								'Email address is not registered in ' +
								APP_NAME;
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
							secondaryText = `Info: Could not check if email address is registered in ${APP_NAME} due to internal error, but invitation will be sent.`;
							break;
					}
					let primaryTextColor: TextColor = 'textPrimary';
					let primaryText = email;
					if (isLoggedUser) {
						primaryTextColor = 'textSecondary';
						primaryText = '[You] ' + primaryText;
					} else if (
						membersStatus[email] === MembersStatus.already_member
					) {
						primaryTextColor = 'textSecondary';
						primaryText = '[Already flat member] ' + primaryText;
					}

					return (
						<React.Fragment key={email}>
							<ListItem alignItems="flex-start">
								{sateIndicator}
								<ListItemText
									primary={
										<Typography
											color={primaryTextColor}
											style={{
												overflowWrap: 'break-word',
											}}
											className={classes.wordBreak}
											title={email}
										>
											{primaryText}
										</Typography>
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
									<IconButton
										edge="end"
										aria-label="delete"
										disabled={formLoading}
										onClick={() => onRemove(email)}
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
				{validEmailsCount === 0
					? 'Add email addresses to invite people to your flat.'
					: validEmailsCount === 1
					? 'One invitation will be sent.'
					: `${validEmailsCount} invitations will be sent.`}
			</p>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
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
			height: 40,
		},
		summary: {
			color: theme.palette.info.light,
			fontStyle: 'italic',
			fontSize: 12,
			textAlign: 'end',
		},
		wordBreak: {
			wordBreak: 'break-word',
		},
	})
);

export default InvitationMembersList;
