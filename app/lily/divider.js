module.exports = {
  install(Vue) {
    Vue.component('divider',  {
      template: `<div style="  border-top: 1px solid rgba(51, 51, 51, 0.25); display: block; margin: 24px 0;"></div>`
    });
  }
};
