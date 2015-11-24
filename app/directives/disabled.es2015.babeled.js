'use strict';

/**
 * @module disabled
 * adds / removes `disabled` attribute on an element
 *
 * usage:
 * <button v-disabled="true">disabled</button>
 */

module.exports = {
  install: function install(Vue, options) {
    Vue.directive('disabled', {
      twoWay: false,
      update: function update(newVal, oldVal) {
        newVal === true ? this.el.setAttribute('disabled', true) : this.el.removeAttribute('disabled');
      }
    });
  }
};