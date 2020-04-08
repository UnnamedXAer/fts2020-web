import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

function not(a: number[], b: number[]) {
	return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a: number[], b: number[]) {
	return a.filter(value => b.indexOf(value) !== -1);
}

interface Props {
	data: {
		id: number;
		labelPrimary: string;
		labelSecondary?: string;
		initialChecked?: boolean;
	}[];
	onChanged: (rightData: number[]) => void;
	listStyle?: React.CSSProperties;
	disabled?: boolean
}

const TransferList: React.FC<Props> = ({
	data,
	onChanged,
	listStyle,
	disabled,
}) => {
	const classes = useStyles();
	const [checked, setChecked] = React.useState<number[]>([]);
	const [left, setLeft] = React.useState(
		data.filter((x) => !x.initialChecked).map((x) => x.id)
	);
	const [right, setRight] = React.useState(
		data.filter((x) => x.initialChecked).map((x) => x.id)
	);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	useEffect(() => {
		onChanged(right);
	}, [right, onChanged]);

	const handleToggle = (value: number) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleAllRight = () => {
		setRight(right.concat(left));
		setLeft([]);
	};

	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked));
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked));
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const handleAllLeft = () => {
		setLeft(left.concat(right));
		setRight([]);
	};

	const customList = (items: number[]) => (
		<Paper className={classes.paper} style={listStyle}>
			<List dense component="div" role="list">
				{items.map((itemId: number) => {
					const labelId = `transfer-list-item-${itemId}-label`;
					const item = data.find((x) => x.id === itemId)!;
					return (
						<ListItem
							key={itemId}
							role="listitem"
							button
							onClick={handleToggle(itemId)}
						>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(itemId) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{ 'aria-labelledby': labelId }}
								/>
							</ListItemIcon>
							<ListItemText
								id={labelId}
								primary={item.labelPrimary}
								secondary={item.labelSecondary}
							/>
						</ListItem>
					);
				})}
				<ListItem />
			</List>
		</Paper>
	);

	return (
		<Grid
			container
			spacing={2}
			justify="center"
			alignItems="center"
			className={classes.root}
		>
			<Grid item>{customList(left)}</Grid>
			<Grid item>
				<Grid container direction="column" alignItems="center">
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleAllRight}
						disabled={disabled || left.length === 0}
						aria-label="move all right"
					>
						≫
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleCheckedRight}
						disabled={disabled || leftChecked.length === 0}
						aria-label="move selected right"
					>
						&gt;
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleCheckedLeft}
						disabled={disabled || rightChecked.length === 0}
						aria-label="move selected left"
					>
						&lt;
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleAllLeft}
						disabled={disabled || right.length === 0}
						aria-label="move all left"
					>
						≪
					</Button>
				</Grid>
			</Grid>
			<Grid item>{customList(right)}</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			margin: 'auto'
		},
		paper: {
			width: 200,
			height: 230,
			overflow: 'auto'
		},
		button: {
			margin: theme.spacing(0.5, 0)
		}
	})
);

export default TransferList;