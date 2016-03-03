module.exports = {
  install(Vue) {
    Vue.component('checkbox', {
      name: 'checkbox',
      props: {
        model: {
          type: Boolean,
          required: true,
          twoWay: true,
          default: false
        },
        trueMessage: {
          type: String,
          default: ''
        },
        falseMessage: {
          type: String,
          default: ''
        }
      },
      template: `
        <div style="position: relative; margin: 6px 0;">
          <style type="text/css">
            .lily-checkbox {
              width: 30px;
              height: 30px;
              background-color: #c3c3c3;
              position: relative;
              display: inline-block;
            }

            .lily-checkbox input[type="checkbox"] {
              visibility: hidden;
            }

            .lily-checkbox input[type="checkbox"]:checked + label {
              background-color: #57bba7;
            }

            .lily-checkbox input[type="checkbox"]:checked + label:before {
              opacity: 1;
            }

            .lily-checkbox label {
              width: 28px;
              height: 28px;
              position: absolute;
              top: 1px;
              left: 1px;
              background-color: white;
              cursor: pointer;
              transition: all 250ms ease;
            }

            .lily-checkbox label:before {
              content: '';
              width: 16px;
              height: 8px;
              border: 2px solid white;
              position: absolute;
              border-top: none;
              border-right: none;
              transform: rotate(-45deg);
              top: 8px;
              left: 6px;
              opacity: 0;
            }
          </style>

          <div class="lily-checkbox" @click="toggle">
            <input type="checkbox" v-model="model">
            <label></label>
          </div>

          <span style="position: absolute; left: 38px; top: 4px; font-size: 108%;">{{ model ? trueMessage : falseMessage }}</span>
        </div>
      `,
      methods: {
        toggle() {
          this.model = !this.model;
        }
      }
    });
  }
};
