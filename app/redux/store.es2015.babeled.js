'use strict';

var _redux = require('redux');

var _authEs2015Babeled = require('./reducers/auth.es2015.babeled.js');

var _authEs2015Babeled2 = _interopRequireDefault(_authEs2015Babeled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _redux.createStore)((0, _redux.combineReducers)({ auth: _authEs2015Babeled2.default }));