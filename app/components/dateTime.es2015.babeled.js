'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _eonasdanBootstrapDatetimepicker = require('eonasdan-bootstrap-datetimepicker');

var _eonasdanBootstrapDatetimepicker2 = _interopRequireDefault(_eonasdanBootstrapDatetimepicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  install: function install(Vue, options) {
    Vue.component('dateTime', {
      name: 'date',
      props: {
        model: {
          type: String,
          required: true,
          twoWay: true
        },
        format: {
          type: String,
          required: false,
          twoWay: false,
          default: 'DD-MM-YYYY hh:mm A'
        }
      },
      template: '<input type="text">',
      ready: function ready() {
        var _this = this;

        /**
         * on initial binding
         * if: valid format and value is passed, it'll be initiated to that
         * else: now will be used to initiate, which will also be reflected back
         */
        var initalDateTime = (0, _moment2.default)(this.model, this.format);
        if (initalDateTime.isValid() === true) {
          this.$el.value = this.model;
        } else {
          var now = (0, _moment2.default)().format(this.format);
          this.$el.value = now;
          this.model = now;
        }

        this.__dateTimeInstance = (0, _jquery2.default)(this.$el).datetimepicker({
          format: this.format,
          sideBySide: true
        });

        this.__dateTimeInstance.on('dp.change', function (value) {
          // we'll be passing the RAW value from the input
          _this.model = _this.$el.value;
        });
      },
      beforeDestroy: function beforeDestroy() {
        this.__dateTimeInstance.data('DateTimePicker').destroy();
      },

      watch: {
        /**
         * BEFORE you roll your eyes at me, hear moi out
         *
         * we're ONLY watching "outside" changes to "reflect" the change on the RAW input
         * that's it! --- it won't trigger 'dp.change' or anything so it
         * wont lead us into infinite loop or anything
         */

        model: function model(newVal, oldVal) {
          this.$el.value = newVal;
        }
      }
    });
  }
}; /**
    * @module: dateTime
    * a vue component for date-time picker
    *
    * usage:
    * <date-time format="HH:mm" class="form-control" :model.sync="time"></date-time>
    * <date-time format="YYYY-MM-DD" class="form-control" :model.sync="date"></date-time>
    * <date-time format="YYYY-MM-DD hh:mm A" class="form-control" :model.sync="dateTime"></date-time>
    */