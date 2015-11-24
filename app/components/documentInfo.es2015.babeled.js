'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  install: function install(Vue, options) {
    Vue.component('documentInfo', {
      name: 'documentInfo',
      props: {
        src: {
          type: Object,
          required: true,
          twoWay: false,
          default: function _default() {
            return {};
          }
        }
      },
      template: '\n        <div v-show="validDocument" class="text-center">\n          <i class="ion-document-text" style="font-size: 48px;"></i>\n          <div style="padding-top: 0; margin-top: 0;">\n            <h5 v-text="src.name"></h5>\n            <button class="btn btn-sm btn-block btn-danger"><i class="ion-ios-trash-outline"></i>&nbsp;&nbsp;delete</button>\n          </div>\n        </div>',
      computed: {
        validDocument: function validDocument() {
          return this.src.hasOwnProperty('name');
        }
      },
      ready: function ready() {
        // we're setting the ID so can select THIS delete button and change is accordingly
        this.__id = '__' + String(Math.random()).slice(2) + '__';
        this.$el.setAttribute('id', this.__id);
        this.__deleteButton = document.querySelector('#' + this.__id + ' button.btn');
        this.__ondblclickListener = (function (e) {
          var _this = this;

          this.__deleteButton.setAttribute('disabled', 'disabled');
          this.__deleteButton.innerHTML = 'Deleting...';

          _superagent2.default.del(this.src.deleteUrl).end(function (error, response) {
            _this.__deleteButton.removeAttribute('disabled');

            if (response && response.ok === true) {
              _this.__deleteButton.innerHTML = '<span class="text-success">Deleted</span>';
              _this.$emit('deleted', response.body);
            } else {
              _this.__deleteButton.innerHTML = '<span class="text-danger">Error</span>';
            }
          });
        }).bind(this);
        this.__deleteButton.addEventListener('dblclick', this.__ondblclickListener);
      },
      beforeDestroy: function beforeDestroy() {
        this.__deleteButton.removeEventListener('dblclick', this.__ondblclickListener);
      }
    });
  }
}; /**
    * @module documentInfo
    * display document info and emit `deleted` event if deletion went successfully
    *
    * usage:
    * <document-info :src="src" @deleted="deleted"></document-info>
    */