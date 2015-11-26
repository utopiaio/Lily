<script>
  import localforage from 'localforage';
  import request from 'superagent';
  import store from './../store.vue';
  import {API_AUTH_URL, AUTH_STORE_KEY} from './../../config.vue';
  import {AUTH_LOGIN, AUTH_LOGOUT, AUTH_UPDATE} from './../constants/constants.vue';
  import {show, hide} from './../../components/backdrop.vue';

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
    return new Promise((resolve, reject) => {
      localforage.removeItem(AUTH_STORE_KEY, (error) => {
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
  function update(auth) {
    return new Promise((resolve, reject) => {
      localforage.setItem(AUTH_STORE_KEY, Object.assign({}, auth), (error, value) => {
        if(error === null) {
          store.dispatch({type: AUTH_UPDATE, auth: Object.assign({}, value)});
          resolve(Object.assign({}, value));
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

  exports.login = login;
  exports.logout = logout;
  exports.update = update;
  exports.init = init;
</script>
