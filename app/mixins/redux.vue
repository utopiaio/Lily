<script>
  import store from './../redux/store.vue';

  /**
   * a mixin that subscribes to redux store and updates our data
   * so that Vue can do its magic
   */
  export default {
    data() {
      return {
        store: store.getState()
      };
    },
    created() {
      store.subscribe(() => {
        this.store = store.getState();
      });
    }
  };
</script>
