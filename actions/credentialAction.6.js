import CondorDispatcher from './../dispatcher/dispatcher.6.babel.js';
import {LOGIN, LOGOUT} from './../constatnts/credentialConstants.6.babel.js';

const credentialAction = {
  login(credential) {
    CondorDispatcher.handleViewAction({
      actionType: LOGIN,
      credentials: credential
    });
  },

  logout() {
    CondorDispatcher.handleViewAction({
      actionType: LOGOUT
    });
  }
};

export default credentialAction;
