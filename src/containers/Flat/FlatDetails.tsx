import React from 'react'
import { useSelector } from 'react-redux';
import RootState from '../../store/storeTypes';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {

}

type RouterParams = {
	id: string
}

const FlatDetails: React.FC<Props> = (props) => {
	console.log(props);

	const id = +(props.match.params as RouterParams).id;
	console.log('id, ', typeof id, id);
	const flat = useSelector((state: RootState) => state.flats.flats.find(x => x.id === id))!;
	return (
		<p>{flat.name}</p>	
	)
}

export default FlatDetails;