<script>
  import request from 'superagent';

  export default {
    install(Vue, options) {
      Vue.component('documentUpload', {
        name: 'documentUpload',
        props: {
          class: {
            type: String,
            twoWay: false,
            required: false,
            default: ''
          },
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
          model: {
            twoWay: true,
            required: true,
            default() {
              return this.multiple === true ? [] : {};
            }
          }
        },
        template: `<span class="{{ class }}" style="position: relative;overflow: hidden;display: inline-block;"></span>`,
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
          this.__fileInput.setAttribute('style', 'position: absolute;top: 0;right: 0;margin: 0;opacity: 0;-ms-filter: "alpha(opacity=0)";font-size: 200px;direction: ltr;cursor: pointer;');
          this.__fileInput.setAttribute('accept', this.accept);
          if(this.multiple === true) {
            this.__fileInput.setAttribute('multiple', 'multiple');
          }
          this.$el.appendChild(this.__fileInput);

          this.changeListener = function(e) {
            let formData = new FormData();

            for(let i = 0; i < e.target.files.length; i++) {
              formData.append('files[]', e.target.files[i]);
            }

            this.$el.setAttribute('disabled', 'disabled');
            this.__fileInput.setAttribute('disabled', 'disabled');
            this.__span.innerHTML = 'Uploading, please wait...';

            request
              .post('http://rock.io/S3')
              .send(formData)
              .end((error, response) => {
                // setting to an empty string so that uploading the same file again triggers change
                this.__fileInput.value = '';
                this.$el.removeAttribute('disabled');
                this.__fileInput.removeAttribute('disabled');

                if(response.ok === true) {
                  this.__span.innerHTML = `<span class="badge">${response.body.files.length}</span>&nbsp;&nbsp;File${this.multiple === true ? 's': ''} uploaded successfully`;
                  this.model = this.multiple === true ? [...this.model, ...response.body.files] : response.body.files[0];
                } else {
                  this.__span.innerHTML = `Error uploading files`;
                }
              });
          }.bind(this);

          this.__fileInput.addEventListener('change', this.changeListener);
        },
        beforeDestroy() {
          this.__fileInput.removeEventListener('change', this.changeListener);
        }
      });
    }
  };
</script>
