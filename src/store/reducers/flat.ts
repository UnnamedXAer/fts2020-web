import { AppReducer, FlatState, SimpleReducer } from '../storeTypes';
import { FlatActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';
import User from '../../models/user';
let i = 0;
const initialState: FlatState = {
	flats: [
		new Flat({
			id: 1,
			description: 'South street 1',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment1 ',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 2,
			description: 'South street 2',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 2',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 3,
			description: 'South street 3',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 3',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 4,
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 4',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 5,
			description: 'South street 5',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 5',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 6,
			description: 'South street 6',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 6',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		}),
		new Flat({
			id: 7,
			description: 'North street 7',
			createAt: new Date(2020, 1, 5, 15, 35),
			createBy: 1,
			name: 'apartment 2020-01 -> 2020-06',
			members: [new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true),new User(++i, 'test'+i+'@meila.com', 'Unnamed User '+i, 'local', new Date(1993, i, i, i, i,i,i ), '', true)]
		})
	]
};

const setFlats: SimpleReducer<FlatState, Flat[], FlatActionTypes.Set> = (
	state,
	action
) => {
	return {
		...state,
		flats: action.payload
	};
};

const reducer: AppReducer<FlatState, FlatActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatActionTypes.Set:
			return setFlats(state, action);
		default:
			return state;
	}
};

export default reducer;
