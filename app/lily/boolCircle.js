module.exports = {
  install(Vue, options) {
    Vue.component('boolCircle', {
      props: {
        bool: {
          type: Boolean,
          required: false,
          twoWay: false,
          default: false
        },
        size: {
          type: String,
          required: false,
          twoWay: false,
          default: '24px'
        },
        trueColor: {
          type: String,
          required: false,
          twoWay: false,
          default: '#1abc9c'
        },
        falseColor: {
          type: String,
          required: false,
          twoWay: false,
          default: '#e74c3c'
        }
      },
      template: `<i class="fa fa-circle" :style="{fontSize: size, color: bool === true ? trueColor : falseColor}"></i>`
    });
  }
};
