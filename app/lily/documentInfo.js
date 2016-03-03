/**
 * @module documentInfo
 * display document info and emit `deleted` event if deletion went successfully
 *
 * usage:
 * <document-info :src="src" @deleted="deleted"></document-info>
 */
import request from 'superagent';

module.exports = {
  install(Vue) {
    Vue.component('documentInfo', {
      name: 'documentInfo',
      props: {
        authKey: {
          type: String,
          twoWay: false,
          required: true,
          default: 'X-Access-Token'
        },
        jwt: {
          type: String,
          twoWay: false,
          required: true,
          default: ''
        },
        src: {
          type: Object,
          required: true,
          twoWay: false,
          default() {return {};}
        }
      },
      template: `
        <div v-show="validDocument" class="text-center">
          <i class="{{ fileType }}" style="font-size: 48px;"></i>
          <div style="padding-top: 0; margin-top: 0;">
            <h5 v-text="src.name"></h5>
            <button class="btn btn-sm btn-block btn-danger"><i class="ion-ios-trash-outline"></i>&nbsp;&nbsp;Delete</button>
          </div>
        </div>`,
      computed: {
        validDocument() {
          return this.src.hasOwnProperty('name');
        },
        fileType() {
          let type = this.src.type || '';

          if(type.search('image') > -1) {
            return 'fa fa-file-image-o';
          } else if(type.search('text') > -1) {
            return 'fa fa-file-text-o';
          } else if(type.search('application') > -1) {
            return 'fa fa-file-pdf-o';
          } else if(type.search('audio') > -1) {
            return 'fa fa-file-sound-o';
          } else if(type.search('video') > -1) {
            return 'fa fa-file-video-o';
          } else {
            return 'fa fa-file-o';
          }
        }
      },
      ready() {
        // we're setting the ID so can select THIS delete button and change is accordingly
        this.__id = `__${String(Math.random()).slice(2)}__`;
        this.$el.setAttribute('id', this.__id);
        this.__deleteButton = document.querySelector(`#${this.__id} button.btn`);
        this.__ondblclickListener = () => {
          this.__deleteButton.setAttribute('disabled', 'disabled');
          this.__deleteButton.innerHTML = 'Deleting...';

          request
            .del(this.src.url)
            .set(this.authKey, this.jwt)
            .end((error, response) => {
              if(response && response.ok === true) {
                this.__deleteButton.innerHTML = 'Deleted';
                this.$emit('deleted', response.body);
              } else {
                this.__deleteButton.removeAttribute('disabled');
                this.__deleteButton.innerHTML = 'Error';
              }
            });
        };
        this.__deleteButton.addEventListener('dblclick', this.__ondblclickListener);
      },
      beforeDestroy() {
        this.__deleteButton.removeEventListener('dblclick', this.__ondblclickListener);
      }
    });
  }
};
