import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import IndexReducer from './reducers/IndexReducer';

const rootReducer = combineReducers({
    index: IndexReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply middleware
export default store;
