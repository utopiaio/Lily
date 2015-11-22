<script>
  /**
   * @module documentInfo
   * display document info and emit `deleted` event if deletion went successfully
   */

  import request from 'superagent';

  export default {
    install(Vue, options) {
      Vue.component('documentInfo', {
        name: 'documentInfo',
        props: {
          src: {
            type: Object,
            required: true,
            twoWay: false,
            default() {return {};}
          }
        },
        template: `
          <div v-show="validDocument" class="text-center">
            <i class="ion-document-text" style="font-size: 48px;"></i>
            <div style="padding-top: 0; margin-top: 0;">
              <h5 v-text="src.name"></h5>
              <button class="btn btn-sm btn-block btn-danger"><i class="ion-ios-trash-outline"></i>&nbsp;&nbsp;delete</button>
            </div>
          </div>`,
        computed: {
          validDocument() {
            return this.src.hasOwnProperty('name');
          }
        },
        ready() {
          // we're setting the ID so can select THIS delete button and change is accordingly
          this.__id = `__${String(Math.random()).slice(2)}__`;
          this.$el.setAttribute('id', this.__id);
          this.__deleteButton = document.querySelector(`#${this.__id} button.btn`);
          this.__ondblclickListener = function(e) {
            this.__deleteButton.setAttribute('disabled', 'disabled');
            this.__deleteButton.innerHTML = 'Deleting...';
            request
              .del(this.src.deleteUrl)
              .end((error, response) => {
                this.__deleteButton.removeAttribute('disabled');

                if(response && response.ok === true) {
                  this.__deleteButton.innerHTML = 'Deleted';
                  this.$emit('deleted', response.body);
                } else {
                  this.__deleteButton.innerHTML = 'Error';
                }
              });
          }.bind(this);
          this.__deleteButton.addEventListener('dblclick', this.__ondblclickListener);
        },
        beforeDestroy() {
          this.__deleteButton.removeEventListener('dblclick', this.__ondblclickListener);
        }
      });
    }
  };
</script>
