<script>
  import $ from 'jquery';
  import moment from 'moment';
  import datetime from 'eonasdan-bootstrap-datetimepicker';

  /**
   * usage:
   *
   * <date-time format="HH:mm" class="form-control" :model.sync="time"></date-time>
   * <date-time format="YYYY-MM-DD" class="form-control" :model.sync="date"></date-time>
   * <date-time format="YYYY-MM-DD hh:mm A" class="form-control" :model.sync="dateTime"></date-time>
   */
  export default {
    install(Vue, options) {
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
        template: `<input type="text">`,
        ready() {
          /**
           * on initial binding
           * if: valid format and value is passed, it'll be initiated to that
           * else: now will be used to initiate, which will also be reflected back
           */
          let initalDateTime = moment(this.model, this.format);
          if(initalDateTime.isValid() === true) {
            this.$el.value = this.model;
          } else {
            let now = moment().format(this.format);
            this.$el.value = now;
            this.model = now;
          }

          this.__dateTimeInstance = $(this.$el).datetimepicker({
            format: this.format,
            sideBySide: true
          });

          this.__dateTimeInstance.on('dp.change', (value) => {
            // we'll be passing the RAW value from the input
            this.model = this.$el.value;
          });
        },
        beforeDestroy() {
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
          model(newVal, oldVal) {
            this.$el.value = newVal;
          }
        }
      });
    }
  };
</script>
