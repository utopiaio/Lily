'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _bootstrap = require('bootstrap');

var _bootstrap2 = _interopRequireDefault(_bootstrap);

var _summernote = require('summernote');

var _summernote2 = _interopRequireDefault(_summernote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  install: function install(Vue, options) {
    Vue.component('summernote', {
      props: {
        model: {
          type: String,
          required: true,
          twoWay: true,
          default: ''
        },
        options: {
          type: Object,
          required: false,
          twoWay: false,
          default: function _default() {
            return { height: 300, toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['table', ['table']], ['insert', ['link', 'picture', 'hr']], ['view', ['fullscreen']]] };
          }
        }
      },
      template: '<div></div>',
      ready: function ready() {
        var _this = this;

        this.__summernote = (0, _jquery2.default)(this.$el).summernote(this.options);
        this.__summernote.code(this.model);
        this.__summernote.on('summernote.change', function (customEvent, contents, $editable) {
          _this.model = contents;
        });
      },
      beforeDestroy: function beforeDestroy() {
        this.__summernote.destroy();
      }
    });
  }
}; /**
    * @module summoernote
    * summernote component - basic initiation, destroy and update on change
    *
    * usage:
    * <summernote :model.sync="model"></summernote>
    * <summernote :model.sync="model" :options="{height: 300, toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']]]}"></summernote>
    */