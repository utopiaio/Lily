import { API_SET, API_POST, API_PATCH, API_DELETE } from './../constants/constants';

function API(state = {}, action) {
  switch(action.type) {
  // action: {table: Object, entries: Object}
  case API_SET:
    return Object.assign({}, state, {[action.table.name]: action.entries});

  // action: {table: Object, entry: Object}
  case API_POST:
  case API_PATCH:
    return Object.assign({}, state, {[action.table.name]: Object.assign({}, state[action.table.name], {[action.entry[action.table.id]]: action.entry})});

    // action: {table: Object, entry: Object}
  case API_DELETE:
    let stateCopy = Object.assign({}, state);
    delete stateCopy[action.table.name][action.entry[action.table.id]];
    return stateCopy;

  default:
    return state;
  }
}

module.exports = API;
