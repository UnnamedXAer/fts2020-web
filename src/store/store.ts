import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';
import flatsReducer from './reducers/flats';
import tasksReducer from './reducers/tasks';

const rootReducer = combineReducers({
	auth: authReducer,
	flats: flatsReducer,
	tasks: tasksReducer
});

const middleware = [ReduxThunk];

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
