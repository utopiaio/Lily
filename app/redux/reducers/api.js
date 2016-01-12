import request from 'superagent';
import { API_SET, API_POST, API_PUT, API_DELETE, PURGE_STORE } from './../constants/constants';

function API(state = {}, action) {
  switch(action.type) {
    // {table: String, rows: Array}
    case API_SET:
      return Object.assign({}, state, {[action.table]: action.rows});
    break;

    // {table: String, row: Object}
    case API_POST:
      return Object.assign({}, state, {[action.table]: [...state[action.table], action.row]});
    break;

    // {table: String, index: Number, row: Object}
    case API_PUT:
      return Object.assign({}, state, {
        [action.table]: [...state[action.table].slice(0, action.index), Object.assign({}, state[action.table][action.index], action.row), ...state[action.table].slice(action.index + 1)]});
    break;

    // {table: String, index: Number}
    case API_DELETE:
      return Object.assign({}, state, {[action.table]: [...state[action.table].slice(0, action.index), ...state[action.table].slice(action.index + 1)]});
    break;

    // *clears* the store
    case PURGE_STORE:
      return Object.assign({});
    break;

    default:
      return state;
    break;
  }
}

module.exports = API;
