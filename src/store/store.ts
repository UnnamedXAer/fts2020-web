import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';
import flatReducer from './reducers/flat';

const rootReducer = combineReducers({
	auth: authReducer,
	flats: flatReducer
});

const middleware = [ReduxThunk];

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
