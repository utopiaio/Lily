/**
 * @module: tooltip
 * a directive for bootstrap tooltip plug-in
 *
 * usage:
 * usage is exactly the same as in Bootstrap, except for the directive v-tooltip
 * <button data-toggle="tooltip" data-placement="left" title="Click to edit" v-tooltip></button>
 * OR with parameter binding
 * <button data-toggle="tooltip" :data-placement="position" :title="title" v-tooltip></button>
 */

import $ from 'jquery';
import bootsrap from 'bootstrap';

module.exports = {
  install(Vue, options) {
    Vue.directive('tooltip', {
      acceptStatement: true,
      params: ['data-placement', 'title'],
      bind() {
        $(this.el).tooltip({
          title: this.params.title,
          placement: this.params.dataPlacement
        });
      },
      unbind() {
        $(this.el).tooltip('destroy');
      }
    });
  }
};
