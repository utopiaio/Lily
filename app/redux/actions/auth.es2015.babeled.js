'use strict';

var _localforage = require('localforage');

var _localforage2 = _interopRequireDefault(_localforage);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _storeEs2015Babeled = require('./../store.es2015.babeled.js');

var _storeEs2015Babeled2 = _interopRequireDefault(_storeEs2015Babeled);

var _constantsEs2015Babeled = require('./../constants/constants.es2015.babeled.js');

var _backdropEs2015Babeled = require('./../../components/backdrop.es2015.babeled.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * authenticates with given credentials
 *
 * @param {String} path - URL to send the request to
 * @credentials {Object}
 * @credentials.username {String}
 * @credentials.password {String}
 * @return {Promise}
 */
function login() {
  var path = arguments.length <= 0 || arguments[0] === undefined ? 'http://rock.io/authenticate' : arguments[0];
  var credentials = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    (0, _backdropEs2015Babeled.show)();

    _superagent2.default.post(path).send(credentials).end(function (error, response) {
      (0, _backdropEs2015Babeled.hide)();

      if (response && response.ok === true) {
        _localforage2.default.setItem('auth', response.body, function (_error, value) {
          if (error === null) {
            _storeEs2015Babeled2.default.dispatch({ type: _constantsEs2015Babeled.AUTH_LOGIN, auth: response.body });
            resolve(value);
          } else {
            reject(_error);
          }
        });
      } else {
        if ((response && response.body && response.body.error) !== undefined) {
          reject(response.body.error);
        } else {
          reject(error);
        }
      }
    });
  });
}

/**
 * will clear the auth info inside `auth`
 * this function will always resolve
 *
 * @return {Prmomise}
 */
function logout() {
  return new Promise(function (resolve, reject) {
    _localforage2.default.removeItem('auth', function (error) {
      _storeEs2015Babeled2.default.dispatch({ type: _constantsEs2015Babeled.AUTH_LOGOUT });
      resolve();
    });
  });
}

/**
 * this should be called before the app is "initiated"
 *
 * @return {Promise}
 */
function init() {
  return new Promise(function (resolve, reject) {
    _localforage2.default.getItem('auth').then(function (value) {
      if (value === null) {
        reject('no auth');
      } else {
        _storeEs2015Babeled2.default.dispatch({ type: _constantsEs2015Babeled.AUTH_UPDATE, auth: value });
        resolve(value);
      }
    });
  });
}

exports.login = login;
exports.logout = logout;
exports.init = init;