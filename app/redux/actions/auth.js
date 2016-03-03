import localforage from 'localforage';
import request from 'superagent';
import { store } from './../store';
import { API_AUTH_URL, API_AUTH_HEADER, AUTH_STORE_KEY } from './../../config';
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_UPDATE } from './../constants/constants';
import { show, hide } from './../../lily/backdrop';



/**
 * authenticates with given credentials
 *
 * @credentials {Object}
 * @credentials.username {String} username
 * @credentials.password {String} raw password
 * @return {Promise}
 */
function login(credentials = {}) {
  return new Promise((resolve, reject) => {
    show();

    request
      .post(API_AUTH_URL)
      .send(credentials)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          localforage.setItem(AUTH_STORE_KEY, response.body, (_error, value) => {
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
  return new Promise((resolve) => {
    localforage.removeItem(AUTH_STORE_KEY, () => {
      store.dispatch({type: AUTH_LOGOUT});
      resolve();
    });
  });
}



/**
 * updates Auth info
 *
 * @return {Promise}
 */
function update() {
  return new Promise((resolve, reject) => {
    let auth = store.getState().auth;

    request
      .get(API_AUTH_URL)
      .set(API_AUTH_HEADER, auth.jwt)
      .end((error, response) => {
        if(response && response.ok === true) {
          localforage.setItem(AUTH_STORE_KEY, Object.assign({}, response.body), (error, value) => {
            if(error === null) {
              store.dispatch({type: AUTH_UPDATE, auth: Object.assign({}, value)});
              resolve(value);
            } else {
              reject(error);
            }
          });
        } else {
          reject(error);
        }
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
    localforage.getItem(AUTH_STORE_KEY).then((value) => {
      if(value === null) {
        reject('no auth');
      } else {
        store.dispatch({type: AUTH_UPDATE, auth: value});
        resolve(value);
      }
    });
  });
}



export {
  login,
  logout,
  update,
  init
};
