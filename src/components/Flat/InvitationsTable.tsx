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
import HttpErrorParser from '../../utils/parseError';
import { useDispatch } from 'react-redux';
import { updateInvitation } from '../../store/actions/flats';
import CustomMuiAlert from '../UI/CustomMuiAlert';

interface Props {
	invitations: Invitation[] | undefined;
	loading: boolean;
	error: StateError;
	flatOwner: boolean;
	flatId: number;
}

const InvitationsTable: React.FC<Props> = ({
	invitations,
	loading,
	error,
	flatOwner,
	flatId,
}) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedInId, setSelectedInId] = useState<number | null>(null);
	const [loadingInvs, setLoadingInvs] = useState<{ [key: number]: boolean }>(
		{}
	);
	const [invsErrors, setInvsErrors] = useState<{ [key: number]: StateError }>(
		{}
	);
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

	const menuActionHandler = async (id: number, action: InvitationAction) => {
		setLoadingInvs((prevState) => ({ ...prevState, [id]: true }));
		try {
			await dispatch(updateInvitation(id, flatId, action));
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setInvsErrors((prevState) => ({ ...prevState, [id]: msg }));
			}
		}
		isMounted.current &&
			setLoadingInvs((prevState) => ({ ...prevState, [id]: false }));
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
							{flatOwner && (
								<StyledTableCell align="right">
									Actions
								</StyledTableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<LoadingTableRows
								colsNumber={flatOwner ? 5 : 4}
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
									{flatOwner && (
										<StyledTableCell align="right">
											{loadingInvs[inv.id] ? (
												<CircularProgress />
											) : (
												<IconButton
													title="Invitation menu"
													onClick={(ev) =>
														openMenuHandler(
															ev,
															inv.id!
														)
													}
												>
													<MoreVertRoundedIcon />
												</IconButton>
											)}
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
						InvitationStatus.NOT_SENT,
						InvitationStatus.SEND_ERROR,
					].includes(
						invitations!.find((x) => x.id === selectedInId!)!.status
					) && (
						<MenuItem
							onClick={() =>
								menuActionHandler(
									selectedInId!,
									InvitationAction.CANCEL
								)
							}
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
							onClick={() =>
								menuActionHandler(
									selectedInId!,
									InvitationAction.RESEND
								)
							}
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
