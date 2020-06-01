import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

interface Props {
	colsNumber: number;
	rowsNumber: number;
	height?: number;
}

export const LoadingTableRows: React.FC<Props> = ({
	rowsNumber,
	colsNumber,
	height,
}) => {
	const cells: React.ReactElement[] = [],
		rows: React.ReactElement[] = [];

	for (let i = 0; i < colsNumber; i++) {
		cells.push(
			<TableCell key={i}>
				<Skeleton animation="wave" height={height} />
			</TableCell>
		);
	}

	for (let i = 0; i < rowsNumber; i++) {
		rows.push(<TableRow key={i}>{cells}</TableRow>);
	}
	return <>{rows}</>;
};
