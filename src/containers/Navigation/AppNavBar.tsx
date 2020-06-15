import React, { useRef, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../store/actions/auth';
import RootState from '../../store/storeTypes';
import { useHistory } from 'react-router-dom';

interface Props {
	children?: React.ReactNode;
	title: string;
	drawerWidth: number;
}

const AppNavBar: React.FC<Props> = (props) => {
	const classes = useStyles({ drawerWidth: props.drawerWidth });
	const history = useHistory();
	const dispatch = useDispatch();
	const loggedUserId = useSelector<RootState, number | undefined>(
		(state) => state.auth.user?.id
	);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const menuCloseHandler = () => {
		setAnchorEl(null);
	};

	const logoutHandler = async () => {
		await dispatch(logOut());
		if (isMounted.current) {
			setAnchorEl(null);
			history.push('/');
		}
	};

	const openProfileHandler = () => {
		history.push(`/profile/${loggedUserId!}`);
		setAnchorEl(null);
	};

	return (
		<>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					{/* <IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<MenuIcon />
					</IconButton> */}
					<Typography variant="h6" className={classes.title}>
						{props.title}
					</Typography>
					<div>
						{loggedUserId && (
							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
						)}
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={menuCloseHandler}
						>
							<MenuItem onClick={openProfileHandler}>
								Profile
							</MenuItem>
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</>
	);
};

const useStyles = makeStyles<Theme, { drawerWidth: number }>((theme: Theme) =>
	createStyles({
		appBar: {
			width: (props) => `calc(100% - ${props.drawerWidth}px)`,
			marginLeft: (props) => props.drawerWidth,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	})
);

export default AppNavBar;
