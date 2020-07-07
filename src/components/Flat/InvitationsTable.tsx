import React, { useState, useRef, useEffect } from 'react';
import {
	IconButton,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableBody,
	makeStyles,
	Theme,
	Menu,
	MenuItem,
	CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import Invitation, {
	InvitationStatusInfo,
	InvitationStatus,
	InvitationAction,
} from '../../models/invitation';
import { StyledTableCell, StyledTableRow } from '../UI/Table';
import { LoadingTableRows } from '../UI/LoadingTableRows';
import { StateError } from '../../ReactTypes/customReactTypes';
import CustomMuiAlert from '../UI/CustomMuiAlert';

interface Props {
	invitations: Invitation[] | undefined;
	loading: boolean;
	error: StateError;
	flatOwner: boolean;
	loadingInvs: { [key: number]: boolean };
	onInvitationAction: (id: number, action: InvitationAction) => void;
	disabled: boolean;
}

const InvitationsTable: React.FC<Props> = ({
	invitations,
	loadingInvs,
	loading,
	error,
	flatOwner,
	onInvitationAction,
	disabled,
}) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedInId, setSelectedInId] = useState<number | null>(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const openMenuHandler = (
		ev: React.MouseEvent<HTMLButtonElement>,
		id: number
	) => {
		setAnchorEl(ev.currentTarget);
		setSelectedInId(id);
	};

	const closeMenuHandler = () => {
		setAnchorEl(null);
		setSelectedInId(null);
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="flat tasks">
					<TableHead>
						<TableRow>
							<StyledTableCell>Email Address</StyledTableCell>
							<StyledTableCell align="right">
								Create Date
							</StyledTableCell>
							<StyledTableCell align="right">
								Status
							</StyledTableCell>
							<StyledTableCell align="right">
								Action Date
							</StyledTableCell>
							{flatOwner && !disabled && (
								<StyledTableCell align="right">
									Actions
								</StyledTableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<LoadingTableRows
								colsNumber={flatOwner && !disabled ? 5 : 4}
								rowsNumber={2}
							/>
						) : (
							invitations?.map((inv) => (
								<StyledTableRow key={inv.id} hover>
									<StyledTableCell component="th" scope="row">
										{inv.emailAddress}
									</StyledTableCell>
									<StyledTableCell align="right">
										{moment(inv.createAt).format(
											'Do MMMM YYYY'
										)}
									</StyledTableCell>
									<StyledTableCell align="right">
										{InvitationStatusInfo[inv.status]}
									</StyledTableCell>
									<StyledTableCell align="right">
										{inv.actionDate
											? moment(inv.actionDate).format(
													'Do MMMM YYYY'
											  )
											: ''}
									</StyledTableCell>
									{flatOwner && !disabled && (
										<StyledTableCell align="right">
											<IconButton
												title="Invitation menu"
												onClick={(ev) =>
													openMenuHandler(ev, inv.id!)
												}
												disabled={loadingInvs[inv.id]}
											>
												{loadingInvs[inv.id] ? (
													<CircularProgress
														color="primary"
														size={24}
													/>
												) : (
													<MoreVertRoundedIcon />
												)}
											</IconButton>
										</StyledTableCell>
									)}
								</StyledTableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			{error && (
				<CustomMuiAlert
					title="Could not load invitations."
					severity="error"
				>
					{error}
				</CustomMuiAlert>
			)}
			<Menu
				id="invitation-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={closeMenuHandler}
			>
				{invitations &&
					selectedInId &&
					[
						InvitationStatus.PENDING,
						InvitationStatus.CREATED,
						InvitationStatus.SEND_ERROR,
					].includes(
						invitations!.find((x) => x.id === selectedInId!)!.status
					) && (
						<MenuItem
							onClick={() => {
								closeMenuHandler();
								onInvitationAction(
									selectedInId!,
									InvitationAction.CANCEL
								);
							}}
						>
							Cancel
						</MenuItem>
					)}
				{invitations &&
					selectedInId &&
					![
						InvitationStatus.PENDING,
						InvitationStatus.ACCEPTED,
					].includes(
						invitations!.find((x) => x.id === selectedInId!)!.status
					) && (
						<MenuItem
							onClick={() => {
								closeMenuHandler();
								onInvitationAction(
									selectedInId!,
									InvitationAction.RESEND
								);
							}}
						>
							Resend
						</MenuItem>
					)}
			</Menu>
		</>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		minWidth: 550,
	},
}));
export default InvitationsTable;
