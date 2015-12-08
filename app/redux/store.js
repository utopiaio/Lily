import { createStore, combineReducers } from 'redux';
import auth from './reducers/auth';
import API from './reducers/api';
import connection from './reducers/connection';

module.exports = createStore(combineReducers({auth, API, connection}));



