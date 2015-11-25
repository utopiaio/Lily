<script>
  import store from './../redux/store.vue';

  /**
   * a mixin that subscribes to redux store and updates our data
   * so that Vue can do its magic
   */
  module.exports = {
    data() {
      return {
        store: store.getState()
      };
    },
    created() {
      this.unsubscribe = store.subscribe(() => {
        this.store = store.getState();
      });
    },
    beforeDestroy() {
      this.unsubscribe();
    }
  };
</script>
