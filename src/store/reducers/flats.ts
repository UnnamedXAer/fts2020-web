import { AppReducer, FlatsState, SimpleReducer } from '../storeTypes';
import { FlatsActionTypes } from '../actions/actionTypes';
import Flat from '../../models/flat';
import User from '../../models/user';
let i = 0;
const initialState: FlatsState = {
	flats: [
		new Flat({
			id: 1,
			description: 'South street 1',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment1 ',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 2,
			description: 'South street 2',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment 2',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 3,
			description: 'South street 3',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment 3',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 4,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'Container is defined but never used  @typescript-e',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 5,
			description: 'South street 5',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment 5',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 6,
			description: 'South street 6',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment 6',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		}),
		new Flat({
			id: 7,
			description: 'North street 7',
			createAt: new Date(2020, 1, 5, 15, 35),
			owner: new User(
				++i,
				'owner' + i + '@meila.com',
				'Long John Silver ' + i,
				'local',
				new Date(1993, i, i, i, i, i, i),
				'',
				true
			),
			name: 'apartment 2020-01 -> 2020-06',
			members: [
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				),
				new User(
					++i,
					'test' + i + '@meila.com',
					'Unnamed User ' + i,
					'local',
					new Date(1993, i, i, i, i, i, i),
					'',
					true
				)
			]
		})
	]
};

const setFlats: SimpleReducer<FlatsState, Flat[], FlatsActionTypes.Set> = (
	state,
	action
) => {
	return {
		...state,
		flats: action.payload
	};
};

const addFlat: SimpleReducer<FlatsState, Flat, FlatsActionTypes.Add> = (
	state,
	action
) => {
	return {
		...state,
		flats: state.flats.concat(action.payload)
	};
};

const reducer: AppReducer<FlatsState, number> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case FlatsActionTypes.Set:
			return setFlats(state, action);
		case FlatsActionTypes.Add:
			return addFlat(state, action);
		default:
			return state;
	}
};

export default reducer;
