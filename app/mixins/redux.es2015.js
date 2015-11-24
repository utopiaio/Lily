import store from './../redux/store.es2015.babeled.js';

/**
 * a mixin that subscribes to redux store and updates our data
 * so that Vue can do its magic
 */
module.exports = {
  data() {
    return {
      store: store.getState()
    };
  },
  created() {
    store.subscribe(() => {
      this.store = store.getState();
    });
  }
};
