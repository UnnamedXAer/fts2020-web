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
import { useDispatch } from 'react-redux';
import {
	SupervisedUserCircle as UserCircleIcon,
	EmailRounded as MoreVertIcon,
	DeleteRounded as DeleteIcon
} from '@material-ui/icons';

interface Props {
	members: User[] | undefined;
	loading: boolean;
}

const FlatMembers: React.FC<Props> = ({ members, loading }) => {
	const dispatch = useDispatch();

	const sendEmailHandler = (emailAddress: string) => {};

	const deleteHandler = (id: number) => {
		const response = window.confirm(
			`Do you really want to remove user: ${
				members!.find(x => x.id === id)?.emailAddress
			}`
		);
		if (response) {
			dispatch({
				type: ''
			});
		}
	};

	if (loading) {
		return <CircularProgress color="primary" />;
	}

	return (
		<List>
			{members?.map(member => (
				<ListItem button key={member.id}>
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
						<IconButton
							onClick={() =>
								sendEmailHandler(member.emailAddress)
							}
						>
							<MoreVertIcon />
						</IconButton>
						<IconButton onClick={() => deleteHandler(member.id)}>
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

export default FlatMembers;
