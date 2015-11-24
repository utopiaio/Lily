'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * @module documentUpload
                                                                                                                                                                                                     * Vue component for document upload
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * usage:
                                                                                                                                                                                                     * <document-upload class="btn btn-default btn-block" :model.sync="model" url="http://rock.io/S3" accept="image/*" :multiple="true"><document-upload>
                                                                                                                                                                                                     */

module.exports = {
  install: function install(Vue, options) {
    Vue.component('documentUpload', {
      name: 'documentUpload',
      props: {
        multiple: {
          type: Boolean,
          twoWay: false,
          required: false,
          default: false
        },
        accept: {
          type: String,
          twoWay: false,
          required: false,
          default: '*/*'
        },
        url: {
          type: String,
          twoWay: false,
          required: true,
          default: 'http://rock.io/S3'
        },
        model: {
          twoWay: true,
          required: true,
          default: function _default() {
            return [];
          }
        }
      },
      template: '<span style="position: relative;overflow: hidden;display: inline-block;"></span>',
      ready: function ready() {
        // making sure the initial valid is an Array for for multiple uploads
        // if a non Array method is passed, it'll be initiated by an empty array
        if (this.multiple === true && Array.isArray(this.model) === false) {
          this.model = [];
        }

        this.__span = document.createElement('span');
        this.__span.innerHTML = 'Click here to select file' + (this.multiple === true ? 's' : '');
        this.$el.appendChild(this.__span);

        this.__fileInput = document.createElement('input');
        this.__fileInput.setAttribute('type', 'file');
        this.__fileInput.setAttribute('style', 'position: absolute;top: 0;right: 0;margin: 0;opacity: 0;-ms-filter: "alpha(opacity=0)";font-size: 200px;direction: ltr;cursor: pointer;');
        this.__fileInput.setAttribute('accept', this.accept);
        if (this.multiple === true) {
          this.__fileInput.setAttribute('multiple', 'multiple');
        }
        this.$el.appendChild(this.__fileInput);

        this.__changeListener = (function (e) {
          var _this = this;

          var formData = new FormData();

          for (var i = 0; i < e.target.files.length; i++) {
            formData.append('files[]', e.target.files[i]);
          }

          this.$el.setAttribute('disabled', 'disabled');
          this.__fileInput.setAttribute('disabled', 'disabled');
          this.__span.innerHTML = 'Uploading, please wait...';

          _superagent2.default.post(this.url).send(formData).end(function (error, response) {
            // setting to an empty string so that uploading the same file again triggers change
            _this.__fileInput.value = '';
            _this.$el.removeAttribute('disabled');
            _this.__fileInput.removeAttribute('disabled');

            if (response && response.ok === true) {
              _this.__span.innerHTML = '<span class="badge">' + response.body.files.length + '</span>&nbsp;&nbsp;<span class="text-success">File' + (_this.multiple === true ? 's' : '') + ' uploaded successfully</span>';
              _this.model = _this.multiple === true ? [].concat(_toConsumableArray(_this.model), _toConsumableArray(response.body.files)) : response.body.files[0];
            } else {
              _this.__span.innerHTML = '<span class="text-danger">Error uploading file' + (_this.multiple === true ? 's' : '') + '</span>';
            }
          });
        }).bind(this);

        this.__fileInput.addEventListener('change', this.__changeListener);
      },
      beforeDestroy: function beforeDestroy() {
        this.__fileInput.removeEventListener('change', this.__changeListener);
      }
    });
  }
};