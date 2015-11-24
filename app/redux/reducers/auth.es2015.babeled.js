'use strict';

var _constantsEs2015Babeled = require('./../constants/constants.es2015.babeled.js');

function Auth() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _constantsEs2015Babeled.AUTH_LOGIN:
      return action.auth;
      break;

    case _constantsEs2015Babeled.AUTH_UPDATE:
      return Object.assign({}, state, action.auth);
      break;

    case _constantsEs2015Babeled.AUTH_LOGOUT:
      return {};
      break;

    default:
      return state;
      break;
  }
}

module.exports = Auth;