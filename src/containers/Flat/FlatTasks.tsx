import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlatTasks } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import { CircularProgress } from '@material-ui/core';
import ErrorCart from '../../components/UI/ErrorCart';
import RootState from '../../store/storeTypes';
import Task from '../../models/task';
import moment from 'moment';

interface Props {
	flatId: number;
}

const FlatTasks: React.FC<Props> = ({ flatId }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const tasks = useSelector<RootState, Task[]>(
		(state) => state.tasks.flatsTasks[flatId]
	);

	useEffect(() => {
		if (!tasks) {
			setLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchFlatTasks(flatId));
				} catch (err) {
					const message = new HttpErrorParser(err).getMessage();
					setError(message);
				}
				setLoading(false);
			};

			loadTasks();
		}
	}, [dispatch, flatId, tasks]);

	if (error) {
		return <ErrorCart message={error} showHeader />;
	} else if (loading) {
		return <CircularProgress color="primary" />;
	}
	return (
		<div>
			{/* <MaterialTable></MaterialTable> */}
			{tasks.map((x) => (
				<div key={x.id} style={{
					border: '1px solid #eee',
					boxShadow: '0 1px 2px #ccc',
					marginBottom: '16px',
					paddingLeft: '16px',
					paddingRight: '16px'
				}}>
					<p>{x.name}</p>
					<p>{x.description}</p>
					<p>
						{moment(x.startDate).format()} -{' '}
						{moment(x.endDate).format('Do MMMM YYYY')}
					</p>
					<p>
						repeat every: {x.timePeriodValue} {x.timePeriodUnit}
						{x.timePeriodValue === 1 ? '' : 's'}
					</p>
				</div>
			))}
		</div>
	);
};

export default FlatTasks;
