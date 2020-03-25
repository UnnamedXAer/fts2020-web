import { withStyles, Theme, createStyles, TableCell, TableRow } from '@material-ui/core';

const StyledTableCell = withStyles((theme: Theme) =>
	createStyles({
		head: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white
		},
		body: {
			fontSize: 14
		}
	})
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
	createStyles({
		root: {
			'&:nth-of-type(odd)': {
				backgroundColor: theme.palette.background.default
			}
		}
	})
)(TableRow);

export {StyledTableRow, StyledTableCell}