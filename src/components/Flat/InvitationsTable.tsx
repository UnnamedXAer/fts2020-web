import React from 'react';
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
} from '@material-ui/core';
import moment from 'moment';
import { InfoOutlined as InfoOutlinedIcon } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import Invitation, { InvitationStatusInfo } from '../../models/invitation';
import { StyledTableCell, StyledTableRow } from '../UI/Table';

interface Props {
	invitations: Invitation[] | undefined;
	loading: boolean;
	onInvitationSelect: (id: number) => void;
}

const InvitationsTable: React.FC<Props> = ({
	invitations,
	loading,
	onInvitationSelect,
}) => {
	const classes = useStyles();

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="flat tasks">
				<TableHead>
					<TableRow>
						<StyledTableCell>Email Address</StyledTableCell>
						<StyledTableCell align="right">
							Create Date
						</StyledTableCell>
						<StyledTableCell align="right">Status</StyledTableCell>
						<StyledTableCell align="right">
							Action Date
						</StyledTableCell>
						<StyledTableCell align="right">Actions</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{loading ? (
						<>
							<Skeleton animation="wave" height={46} />
							<Skeleton animation="wave" height={46} />
						</>
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
								<StyledTableCell align="right">
									<IconButton
										title="Task quick info"
										onClick={() =>
											onInvitationSelect(inv.id!)
										}
									>
										<InfoOutlinedIcon />
									</IconButton>
								</StyledTableCell>
							</StyledTableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		minWidth: 550,
	},
}));
export default InvitationsTable;
