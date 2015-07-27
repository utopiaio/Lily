import {Dispatcher} from 'flux';

let CondorDispatcher = Object.assign(new Dispatcher(), {
  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  handleServerAction(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }
});

export default CondorDispatcher;
