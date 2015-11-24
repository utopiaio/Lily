import {createStore, combineReducers} from 'redux';
import auth from './reducers/auth.es2015.babeled.js';

module.exports = createStore(combineReducers({auth}));
