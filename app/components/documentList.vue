<script>
  /**
   * @module documentList
   * this is a soft wrapper for document info component with delete method
   *
   * usage:
   * <document-list :src.sync="documentList"></document-info>
   */

  module.exports = {
    install(Vue, options) {
      Vue.component('documentList', {
        name: 'documentList',
        props: {
          src: {
            required: true,
            twoWay: true
          }
        },
        template: `
          <div>
            <div class="row" v-if="multiple === true">
              <document-info v-for="document in src" track-by="$index" :src="document" @deleted="deleted" class="col-lg-4 col-md-6"></document-info>
            </div>
            <document-info v-if="multiple === false" :src="src" @deleted="deleted"></document-info>
          </div>
        `,
        computed: {
          /**
           * we're computing `multiple` because we can't access `this`
           * inside of props before initialization
           */
          multiple() {
            return Array.isArray(this.src);
          }
        },
        methods: {
          deleted(doc) {
            if(this.multiple === false) {
              this.src = {};
            } else {
              for(let i = this.src.length - 1; i >= 0; i--) {
                if(this.src[i].id === doc.id) {
                  this.src = [...this.src.slice(0, i), ...this.src.slice(i+1)];
                  break;
                }
              };
            }
          }
        }
      });
    }
  };
</script>
