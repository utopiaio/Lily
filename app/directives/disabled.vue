<script>
  /**
   * @module disabled
   * adds / removes `disabled` attribute on an element
   *
   * usage:
   * <button v-disabled="true">disabled</button>
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
