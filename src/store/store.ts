import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';
import flatsReducer from './reducers/flats';
import tasksReducer from './reducers/tasks';
import taskPeriodsReducer from './reducers/periods';
import usersReducer from './reducers/users';
import invitationsReducer from './reducers/invitations';

const rootReducer = combineReducers({
	auth: authReducer,
	flats: flatsReducer,
	tasks: tasksReducer,
	users: usersReducer,
	periods: taskPeriodsReducer,
	invitations: invitationsReducer,
});

const middleware = [ReduxThunk];

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
