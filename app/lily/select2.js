import $ from 'jquery';
import select2 from 'select2';

module.exports = {
  install(Vue, options) {
    Vue.component('select2', {
      name: 'select2',
      props: {
        model: {
          required: true,
          twoWay: true
        },
        placeholder: {
          type: String,
          required: false,
          default: ''
        }
      },
      // directly putting slot inside select tag doesn't render options inside
      // slot, so we're working around that via a bit magic of vanilla and jq
      template: `
        <span>
          <style type="text/css">
            .select2.select2-container {
              width: 100% !important;
            }

            .select-lg .select2.select2-container .select2-selection {
              height: 46px;
              padding: 8px 0;
              font-size: 18px;
            }

            .select-lg .select2.select2-container .select2-selection__arrow {
              height: 46px;
            }
          </style>
          <div style="display: none;"><slot></slot></div>
          <select style="display: none;"></select>
        </span>`,
      ready() {
        let select = $('select', this.$el)[0];
        if(this.$el.hasAttribute('multiple') === true) {
          select.setAttribute('multiple', 'multiple');
        }

        setTimeout(() => {
          select.innerHTML = $('div', this.$el)[0].innerHTML;
          this.__select2 = $(select).select2({ placeholder: this.placeholder });
          $('.select2.select2-container .select2-selection').animate({opacity: 1}, 250);
          this.__select2.val(this.model).trigger('change');
          // we're using `select2:select` and `select2:unselect` instead of `change`
          // so we don't run into infinite loop when triggering `change` inside watch
          this.__select2.on('select2:select', (e) => {
            this.__setModel();
          });

          this.__select2.on('select2:unselect', (e) => {
            this.__setModel();
          });
        }, 250);


        // we'll be setting to an empty array instead of null on multiple mode
        this.__setModel = function() {
          if(this.__select2.val() === null && this.$el.hasAttribute('multiple') === true) {
            this.model = [];
          } else {
            this.model = this.__select2.val();
          }
        }.bind(this);
      },
      beforeDestroy() {
        $(this.__select2).select2('destroy');
      },
      watch: {
        model(newVal, oldVal) {
          if(this.$el.hasAttribute('multiple') === true && newVal === null && this.__select2 !== undefined) {
            this.__select2.val([]).trigger('change');
          } else if(this.__select2 !== undefined) {
            this.__select2.val(newVal).trigger('change');
          }
        }
      }
    });
  }
};
