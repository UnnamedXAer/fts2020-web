import React from 'react';
import {
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	CircularProgress,
} from '@material-ui/core';
import User from '../../models/user';
import {
	SupervisedUserCircle as UserCircleIcon,
	EmailRounded as MoreVertIcon,
	DeleteRounded as DeleteIcon,
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';

interface Props {
	error: StateError;
	members: User[] | undefined;
	loading: boolean;
	loadingMembers?: {
		[key: number]: boolean;
	};
	flatCreateBy?: number;
	onMemberSelect: (id: number) => void;
	onMemberDelete?: (id: number) => void;
}

const MembersList: React.FC<Props> = ({
	error,
	members,
	loading,
	loadingMembers = {},
	flatCreateBy,
	onMemberSelect,
	onMemberDelete,
}) => {
	if (error) {
		return (
			<CustomMuiAlert title="Could not load members." severity="error">
				{error}
			</CustomMuiAlert>
		);
	}

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
						primary={
							<span
								style={{
									wordBreak: 'break-word',
									display: 'inline-block',
									maxWidth: '95%',
								}}
							>
								{member.emailAddress}
							</span>
						}
						secondary={
							<span
								style={{
									wordBreak: 'break-word',
									display: 'inline-block',
									maxWidth: '95%',
								}}
							>
								{member.userName}
							</span>
						}
					/>
					<ListItemSecondaryAction>
						<IconButton
							href={`mailto:${member.emailAddress}?subject=FTS2020%20-%20member%20message`}
						>
							<MoreVertIcon />
						</IconButton>
						{onMemberDelete && (
							<IconButton
								disabled={flatCreateBy === member.id}
								onClick={() => onMemberDelete(member.id)}
							>
								{loadingMembers[member.id] ? (
									<CircularProgress
										color="primary"
										size={24}
									/>
								) : (
									<DeleteIcon />
								)}
							</IconButton>
						)}
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

export default MembersList;
