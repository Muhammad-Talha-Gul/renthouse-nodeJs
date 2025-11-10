import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import IndexReducer from './reducers/IndexReducer';
import adminCategoriesReducer from './reducers/adminCategoriesReducer';

const rootReducer = combineReducers({
    index: IndexReducer,
    categories: adminCategoriesReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply middleware
export default store;
