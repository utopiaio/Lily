import { createStore, combineReducers } from 'redux';
import Vue from 'vue';
import auth from './reducers/auth';
import API from './reducers/api';
import connection from './reducers/connection';

let store = createStore(combineReducers({auth, API, connection}));
// we're going in deep so that all `state` *mutations* that happen to the
// state happen under `state` property (i hope that made sense);
// which will become reactive thanks to a bit of Vue magic
let state = {
  state: {}
};

let Redux = {
  /**
   * Redux store state
   *
   * @return {Object} state object
   */
  get state() {
    return state.state;
  },

  /**
   * this is a big no-no, but one can easily get through
   * NEVER EVER attempt to directly set the state
   * @param {Object} v
   */
  set state(v) {
    throw new Error('you shall not pass...to the state');
  }
};

// our state object becomes reactive --- in-short, Vue magic
let _vm = new Vue({
  data: {state}
});

store.subscribe(() => {
  // if you want to go rouge? use _vm.$set --- though i think it's costly
  // _vm.$set('state.state', store.getState());
  state.state = store.getState();
});

exports.store = store;
exports.redux = Redux;
