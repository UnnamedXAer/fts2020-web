import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFlatTasks } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import { CircularProgress } from '@material-ui/core';
import ErrorCart from '../../components/UI/ErrorCart';

interface Props {
	flatId: number;
}

const FlatTasks: React.FC<Props> = ({ flatId }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
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
	}, [dispatch, flatId]);

	if (error) {return <ErrorCart message={error} showHeader />}
	else if (loading) {return <CircularProgress color="primary" />}
	return <div>{/* <MaterialTable></MaterialTable> */}</div>;
};

export default FlatTasks;
