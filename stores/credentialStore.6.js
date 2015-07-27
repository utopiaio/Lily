import {EventEmitter} from 'events';
import localforage from 'localforage';
import request from 'superagent';
import CondorDispatcher from './../dispatcher/dispatcher.6.babel.js';
import {LOGIN, LOGOUT} from './../constatnts/credentialConstants.6.babel.js';

const CHANGE_EVENT = 'CHANGE';
let credentials = null;



localforage.getItem('credentials', (error, value) => {
  if(error === null) {
    credentials = value;
  }
});



const CredentialStore = Object.assign({}, EventEmitter.prototype, {
  credentials() {
    return credentials;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});



function login(credentials) {
  return new Promise((resolve, reject) => {
    request
      .post('http://rock.io/authenticate')
      .type('application/json')
      .send(credentials)
      .end((error, response) => {
        (error === null && response.status > 199 && response.status < 300) ? resolve(response) : reject(response);
      });
  });
}



CredentialStore.DispatchToken = CondorDispatcher.register((payload) => {
  let action = payload.action;

  switch(action.actionType) {
    case LOGIN:
      login(action.credentials).then((data) => {
        credentials = data.body;
        localforage.setItem('credentials', credentials, (error, value) => {
          CredentialStore.emitChange();
        });
      }, (error) => {
        CredentialStore.emitChange();
      });
    break;

    case LOGOUT:
      localforage.clear((error) => {
        credentials = null;
        CredentialStore.emitChange();
      });
    break;
  }

  return true;
});

export default CredentialStore;
