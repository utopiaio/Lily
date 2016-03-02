/**
 * @module documentUpload
 * Vue component for document upload
 *
 * usage:
 * <document-upload class="btn btn-default btn-block" :model.sync="model" url="http://rock.io/S3" accept="image/*" :multiple="true"><document-upload>
 */
import request from 'superagent';

module.exports = {
  install(Vue, options) {
    Vue.component('documentUpload', {
      name: 'documentUpload',
      props: {
        multiple: {
          type: Boolean,
          twoWay: false,
          required: false,
          default: false
        },
        accept: {
          type: String,
          twoWay: false,
          required: false,
          default: '*/*'
        },
        url: {
          type: String,
          twoWay: false,
          required: true,
          default: 'http://rock.io/S3'
        },
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
        model: {
          twoWay: true,
          required: true,
          default() {
            return [];
          }
        }
      },
      template: `<button type="button"></button>`,
      ready() {
        // making sure the initial valid is an Array for for multiple uploads
        // if a non Array method is passed, it'll be initiated by an empty array
        if(this.multiple === true && Array.isArray(this.model) === false) {
          this.model = [];
        }

        this.__span = document.createElement('span');
        this.__span.innerHTML = `Click here to select file${this.multiple === true ? 's': ''}`;
        this.$el.appendChild(this.__span);

        this.__fileInput = document.createElement('input');
        this.__fileInput.setAttribute('type', 'file');
        this.__fileInput.setAttribute('style', 'display:none;');
        this.__fileInput.setAttribute('accept', this.accept);
        if(this.multiple === true) {
          this.__fileInput.setAttribute('multiple', 'multiple');
        }
        this.$el.appendChild(this.__fileInput);

        this.__clickListener = (e) => {
          let clickEvent = new MouseEvent('click');
          this.__fileInput.dispatchEvent(clickEvent);
        };
        this.$el.addEventListener('click', this.__clickListener);

        this.__changeListener = (e) => {
          let formData = new FormData();

          for(let i = 0; i < e.target.files.length; i++) {
            formData.append('files[]', e.target.files[i]);
          }

          this.$el.setAttribute('disabled', 'disabled');
          this.__fileInput.setAttribute('disabled', 'disabled');
          this.__span.innerHTML = `Uploading, please wait...`;

          request
            .post(this.url)
            .set(this.authKey, this.jwt)
            .send(formData)
            .end((error, response) => {
              // setting to an empty string so that uploading the same file again triggers change
              this.__fileInput.value = '';
              this.$el.removeAttribute('disabled');
              this.__fileInput.removeAttribute('disabled');

              if(response && response.ok === true) {
                this.__span.innerHTML = `<span class="badge">${response.body.length}</span>&nbsp;&nbsp;<span class="text-success">File${this.multiple === true ? 's': ''} uploaded successfully</span>`;
                this.model = this.multiple === true ? [...this.model, ...response.body] : response.body[0];
              } else {
                this.__span.innerHTML = `<span class="text-danger">Error uploading file${this.multiple === true ? 's' : ''}</span>`;
              }
            });
        };
        this.__fileInput.addEventListener('change', this.__changeListener);
      },
      beforeDestroy() {
        this.$el.removeEventListener('click', this.__clickListener);
        this.__fileInput.removeEventListener('change', this.__changeListener);
      }
    });
  }
};
