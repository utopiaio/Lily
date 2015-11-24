import localforage from 'localforage';
import request from 'superagent';
import store from './../store.es2015.babeled.js';
import {AUTH_LOGIN, AUTH_LOGOUT, AUTH_UPDATE} from './../constants/constants.es2015.babeled.js';
import {show, hide} from './../../components/backdrop.es2015.babeled.js';

/**
 * authenticates with given credentials
 *
 * @param {String} path - URL to send the request to
 * @credentials {Object}
 * @credentials.username {String}
 * @credentials.password {String}
 * @return {Promise}
 */
function login(path = 'http://rock.io/authenticate', credentials = {}) {
  return new Promise((resolve, reject) => {
    show();

    request
      .post(path)
      .send(credentials)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          localforage.setItem('auth', response.body, (_error, value) => {
            if(error === null) {
              store.dispatch({type: AUTH_LOGIN, auth: response.body});
              resolve(value);
            } else {
              reject(_error);
            }
          });
        } else {
          if((response && response.body && response.body.error) !== undefined) {
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
  return new Promise((resolve, reject) => {
    localforage.removeItem('auth', (error) => {
      store.dispatch({type: AUTH_LOGOUT});
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
  return new Promise((resolve, reject) => {
    localforage.getItem('auth').then((value) => {
      if(value === null) {
        reject('no auth');
      } else {
        store.dispatch({type: AUTH_UPDATE, auth: value});
        resolve(value);
      }
    });
  });
}

exports.login = login;
exports.logout = logout;
exports.init = init;
