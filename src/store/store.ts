import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
	auth: authReducer
});

const middleware = [ReduxThunk];

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
