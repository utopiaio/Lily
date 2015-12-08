import notie from 'notie';
import { NOTY_INFO } from './../../config';
import { ONLINE, OFFLINE } from './../constants/constants';
import store from './../store';

function connectionListener() {
  notie.alert(4, `You are now ${window.navigator.onLine ? 'online' : 'offline'}`, NOTY_INFO);
  store.dispatch({type: window.navigator.onLine ? ONLINE : OFFLINE});
}

window.addEventListener('online', connectionListener);
window.addEventListener('offline', connectionListener);

module.exports = connectionListener;
