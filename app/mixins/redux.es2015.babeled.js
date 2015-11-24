'use strict';

var _storeEs2015Babeled = require('./../redux/store.es2015.babeled.js');

var _storeEs2015Babeled2 = _interopRequireDefault(_storeEs2015Babeled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * a mixin that subscribes to redux store and updates our data
 * so that Vue can do its magic
 */
module.exports = {
  data: function data() {
    return {
      store: _storeEs2015Babeled2.default.getState()
    };
  },
  created: function created() {
    var _this = this;

    _storeEs2015Babeled2.default.subscribe(function () {
      _this.store = _storeEs2015Babeled2.default.getState();
    });
  }
};