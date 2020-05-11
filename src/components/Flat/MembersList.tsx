import React from 'react';
import {
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
} from '@material-ui/core';
import User from '../../models/user';
import {
	SupervisedUserCircle as UserCircleIcon,
	EmailRounded as MoreVertIcon,
	DeleteRounded as DeleteIcon,
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';

interface Props {
	members: User[] | undefined;
	loading: boolean;
	onMemberSelect: (id: number) => void;
	onMemberDelete?: (id: number) => void;
	onMemberMessage?: (id: number) => void;
}

const MembersList: React.FC<Props> = ({
	members,
	loading,
	onMemberSelect,
	onMemberDelete,
	onMemberMessage,
}) => {
	if (loading || !members) {
		return (
			<>
				<Skeleton animation="wave" height={46} />
				<Skeleton animation="wave" height={46} />
			</>
		);
	}

	return (
		<List>
			{members?.map((member) => (
				<ListItem
					button
					key={member.id}
					onClick={() => onMemberSelect(member.id)}
				>
					<ListItemAvatar>
						<Avatar src={member.avatarUrl}>
							<UserCircleIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={member.emailAddress}
						secondary={member.userName}
					/>
					<ListItemSecondaryAction>
						{onMemberMessage && (
							<IconButton
								onClick={() => onMemberMessage(member.id)}
							>
								<MoreVertIcon />
							</IconButton>
						)}
						{onMemberDelete && (
							<IconButton
								onClick={() => onMemberDelete(member.id)}
							>
								<DeleteIcon />
							</IconButton>
						)}
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

export default MembersList;