<script>
  /**
   * @module disabled
   *
   * adds / removes `disabled` attribute on an element
   */
  export default {
    install(Vue, options) {
      Vue.directive('disabled', {
        twoWay: false,
        update(newVal, oldVal) {
          newVal === true ? this.el.setAttribute('disabled', true) : this.el.removeAttribute('disabled');
        }
      });
    }
  };
</script>
