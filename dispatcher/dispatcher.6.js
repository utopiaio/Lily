import {Dispatcher} from 'flux';

let CondorDispatcher = Object.assign(new Dispatcher(), {
  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW',
      action: action
    });
  },

  handleServerAction(action) {
    this.dispatch({
      source: 'SERVER',
      action: action
    });
  }
});

export default CondorDispatcher;
