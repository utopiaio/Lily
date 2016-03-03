/**
 * @module: imageCrop
 * a Vue component that initiates cropper on an image file upload
 *
 * usage:
 * <image-crop :src.sync="image" :x="16" :y="9" type="image/jpeg" :quality="0.6" url="http://rock.io/S3"></image-crop>
 */
import Cropper from 'cropperjs';
import request from 'superagent';

module.exports = {
  install(Vue) {
    // as the canvas `toBlob` API is only available on Mozila we're using a polyfill (from MDN)
    function _toBlob(canvas, callback, type = 'image/jpeg', quality = 0.6) {
      try {
        let _binaryString = atob(canvas.toDataURL(type, quality).split(',')[1]);
        let _length = _binaryString.length;
        let _array = new Uint8Array(_length);

        for(let i = 0; i < _length; i++) {
          _array[i] = _binaryString.charCodeAt(i);
        }

        callback(null, new Blob([_array], {type}));
      } catch(err) {
        callback(err, null);
      }
    }

    Vue.component('imageCrop', {
      props: {
        src: {
          type: Object,
          required: true,
          twoWay: true,
          default() {return {};}
        },
        x: {
          type: Number,
          required: false,
          twoWay: false,
          default: 16
        },
        y: {
          type: Number,
          required: false,
          twoWay: false,
          default: 9
        },
        type: {
          type: String,
          required: false,
          twoWay: false,
          default: 'image/jpeg'
        },
        quality: {
          type: Number,
          required: false,
          twoWay: false,
          default: 0.6
        },
        url: {
          type: String,
          required: true,
          twoWay: false,
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
        }
      },
      data() {
        return {
          cropped: false,
          cropperInitiated: false,
          selfMutated: false,
          container: ''
        };
      },
      template: `
        <div id="{{ container }}">
          <img v-if="src.url" class="img-responsive" :src="src.url">
          <p style="margin-top: 8px;" v-if="!cropped && src.url">
            <button @click="crop" class="btn btn-default btn-block"><i class="fa fa-crop"></i>&nbsp;&nbsp;Crop</button>
          </p>
        </div>`,
      ready() {
        // this is used for querySelector
        this.container = `container-${String(Math.random()).slice(2)}`;

        // if the initial data provided is valid we'll be initiating the cropper
        if(this.src.hasOwnProperty('type') === true && this.src.type.search(/image/) > -1) {
          // Vue is too fast for the DOM
          // when the component is initiated inside v-for we need to give time
          // before initiating the cropper
          setTimeout(() => {
            this.initiateCropper();
          }, 96);
        }
      },
      methods: {
        /**
         * crop
         * deletes previous image
         * uploads the new cropped image and updates the src
         */
        crop() {
          let button = document.querySelector(`#${this.container} button`);
          button.innerHTML = `<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropping...`;
          button.setAttribute('disabled', 'disabled');
          this.__previousSrc = this.src;

          // uploading the new cropped image & destroying the cropper (if successful)
          _toBlob(this.__cropper.getCroppedCanvas(), (err, blob) => {
            if(err === null) {
              let formData = new FormData();
              formData.append('files[]', blob);

              request
                .post(this.url)
                .send(formData)
                .set(this.authKey, this.jwt)
                .end((error, response) => {
                  button.removeAttribute('disabled');

                  if(response && response.ok === true) {
                    button.innerHTML = `<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropped`;
                    this.setMutationFlag();
                    this.src = response.body[0];
                    this.cropped = true;
                    this.__cropper.destroy();
                    this.cropperInitiated = false;

                    // deleting previous image...
                    request
                      .del(this.__previousSrc.url)
                      .set(this.authKey, this.jwt)
                      .end((error, response) => {
                        if(response && response.ok === true) {
                          // console.info(`Previous file deleted succsufully.`);
                        } else {
                          // console.warn('Unable to delete previous file.')
                        }
                      });
                  } else {
                    button.innerHTML = `<i class="fa fa-crop"></i>&nbsp;&nbsp;<span class="text-danger">Error Cropping</span>`;
                  }
                });
            } else {
              // there was no image to crop in the fist place - image deleted maybe
              this.cropped = true; // hide the crop button
            }
          }, this.type, this.quality);
        },
        /**
         * initiates cropper (and sets to this.__cropper)
         */
        initiateCropper() {
          this.cropperInitiated = true;
          this.__cropper = new Cropper(document.querySelector(`#${this.container} img`), {
            aspectRatio: this.x / this.y,
            guides: false,
            rotatable: false,
            wheelZoomRatio: 0.01,
            autoCropArea: 1,
            dragMode: 'move'
          });
        },
        /**
         * sets selfMutated flag so that we don't reinitialize
         * the cropper if the "change" is initiated *here*
         */
        setMutationFlag() {
          this.selfMutated = true;
          let _selfie = setTimeout(() => {
            this.selfMutated = false;
            clearTimeout(_selfie);
          }, 96);
        }
      },
      watch: {
        src(newVal) {
          if (newVal.hasOwnProperty('type') === true && newVal.type.search(/image/) > -1) {
            if(this.cropperInitiated === false && this.selfMutated === false) {
              // the timeout is required so that the DOM will be ready
              // otherwise cropper will not be properly initiated
              setTimeout(() => {
                this.cropped = false;
                this.setMutationFlag();
                this.initiateCropper();
              }, 96);
            } else if(this.cropperInitiated === true && this.selfMutated === false) {
              // reinitializing the cropper...
              this.cropped = false;
              this.setMutationFlag();
              this.__cropper.replace(newVal.url);
            }
          }
        }
      },
      beforeDestroy() {
        if(this.cropperInitiated === true) {
          this.__cropper.destroy();
        }
      }
    });
  }
};
