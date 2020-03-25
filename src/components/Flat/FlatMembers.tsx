import React, { FC, useState } from 'react';
import {
	ListItem,
	ListItemAvatar,
	List,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Paper,
	MenuList,
	MenuItem,
	makeStyles,
	createStyles,
	Theme,
	Popper,
	Grow,
	ClickAwayListener
} from '@material-ui/core';
import {
	SupervisedUserCircle as UserCircleIcon,
	MoreVert as MoreVertIcon
} from '@material-ui/icons';
import User from '../../models/user';
import { useDispatch } from 'react-redux';

interface Props {
	members: User[];
}

const FlatMembers: FC<Props> = ({ members }) => {
	const classes = useStyle();
	const dispatch = useDispatch();
	const [menuItemId, setMenuItemId] = useState<number | null>(null);

	const itemMenuClickHandler = (id: number) => {
		setMenuItemId(id);
	};

	const menuCloseHandler = () => {
		setMenuItemId(null);
	};

	const menuItemRemoveHandler = () => {
		const response = window.confirm(
			`Do you really want to remove user: ${
				members.find(x => x.id === menuItemId)?.emailAddress
			}`
		);
		if (response) {
			dispatch({type: ''});
		}
	};

	return (
		<List>
			{members.map(member => (
				<ListItem key={member.id} button>
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
							onClick={() => itemMenuClickHandler(member.id)}
						>
							<MoreVertIcon />
						</IconButton>
						<Popper
							open={member.id === menuItemId}
							// anchorEl={anchorRef.current}
							role={undefined}
							transition
							disablePortal
						>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{
										transformOrigin:
											placement === 'bottom'
												? 'center top'
												: 'center bottom'
									}}
								>
									<Paper>
										<ClickAwayListener
											onClickAway={menuCloseHandler}
										>
											<MenuList
												autoFocusItem={
													menuItemId == member.id
												}
												id="menu-list-grow"
												// onKeyDown={handleListKeyDown}
											>
												<MenuItem
													onClick={
														menuItemRemoveHandler
													}
												>
													Remove
												</MenuItem>
											</MenuList>
										</ClickAwayListener>
									</Paper>
								</Grow>
							)}
						</Popper>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			marginRight: theme.spacing(2)
		}
	})
);

export default FlatMembers;
