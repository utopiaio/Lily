import { ONLINE, OFFLINE } from './../constants/constants';

function connection(state = window.navigator.onLine, action) {
  switch (action.type) {
  case ONLINE:
    return true;

  case OFFLINE:
    return false;

  default:
    return state;
  }
}

module.exports = connection;
