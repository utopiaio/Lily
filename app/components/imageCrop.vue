<script>
  /**
   * @module: imageCrop
   * a Vue component that initiates cropper on an image file upload
   *
   * usage:
   * <image-crop :src.sync="image" :x="16" :y="9" type="image/jpeg" :quality="0.6" url="http://rock.io/S3"></image-crop>
   */
  import $ from 'jquery';
  import cropper from 'cropper';
  import request from 'superagent';

  module.exports = {
    install(Vue, options) {
      // as the canvas `toBlob` API is only available on Mozila we're using a polyfill (from MDN)
      function _toBlob(canvas, callback, type, quality) {
        try {
          type = type || 'image/jpeg';
          quality = quality || 0.6;

          let _binaryString = atob(canvas.toDataURL(type, quality).split(',')[1]);
          let _length = _binaryString.length;
          let _array = new Uint8Array(_length);

          for(let i = 0; i < _length; i++) {
            _array[i] = _binaryString.charCodeAt(i);
          }

          callback(null, new Blob([_array], {type: type}));
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
          }
        },
        data() {
          return {
            cropped: false,
            cropperInitiated: false,
            selfMutated: false
          };
        },
        template: `
          <div>
            <img v-if="src.url" class="img-responsive" :src="src.url">
            <p style="margin-top: 8px;" v-if="!cropped">
              <button v-if="src.url" @click="crop" class="btn btn-default btn-block"><i class="fa fa-crop"></i>&nbsp;&nbsp;Crop</button>
            </p>
          </div>`,
        ready() {
          if(this.src.hasOwnProperty('type') === true && this.src.type.search(/image/) > -1) {
            this.initiateCropper();
          }
        },
        methods: {
          /**
           * crop
           * deletes previous image
           * uploads the new cropped image and updates the src
           */
          crop() {
            $('button', this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropping...';
            $('button', this.$el)[0].setAttribute('disabled', 'disabled');
            this.__previousSrc = this.src;

            // uploading the new cropped image & destroying the cropper (if successful)
            _toBlob($(this.__image).cropper('getCroppedCanvas'), (err, blob) => {
              if(err === null) {
                let formData = new FormData();
                formData.append('files[]', blob);

                request
                  .post(this.url)
                  .send(formData)
                  .end((error, response) => {
                    $('button', this.$el)[0].removeAttribute('disabled');

                    if(response && response.ok === true) {
                      $('button', this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropped';
                      this.setMutationFlag();
                      this.src = response.body.files[0];
                      this.cropped = true;
                      this.__cropper.cropper('destroy');
                      this.cropperInitiated = false;

                      // deleting previous image...
                      request
                        .del(this.__previousSrc.deleteUrl)
                        .end((error, response) => {
                          if(response && response.ok === true) {
                            console.info(`Previous file deleted succsufully.`);
                          } else {
                            console.warn('Unable to delete previous file.')
                          }
                        });
                    } else {
                      $('button', this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;<span class="text-danger">Error Cropping</span>';
                    }
                  });
              } else {
                // there was no image to crop in the fist place - image deleted maybe
                this.cropped = true; // hide the crop button
              }
            }, this.type, this.quality);
          },
          /**
           * initiates cropper (and sets to __cropper)
           * also sets `__image`
           */
          initiateCropper() {
            this.cropperInitiated = true;
            this.__image = $('img', this.$el)[0];
            this.__cropper = $(this.__image).cropper({
              aspectRatio: this.x / this.y,
              guides: false,
              rotatable: false,
              wheelZoomRatio: 0.01,
              autoCropArea: 1
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
            }, 125);
          }
        },
        watch: {
          src(newVal, oldVal) {
            if(newVal.hasOwnProperty('type') === true && newVal.type.search(/image/) > -1) {
              if(this.cropperInitiated === false && this.selfMutated === false) {
                // the timeout is required so that the DOM will be ready
                // otherwise cropper will not be properly initiated
                setTimeout(() => {
                  this.cropped = false;
                  this.setMutationFlag();
                  this.initiateCropper();
                }, 125);
              } else if(this.cropperInitiated === true && this.selfMutated === false) {
                // reinitializing the cropper...
                this.cropped = false;
                this.setMutationFlag();
                this.__cropper.cropper('replace', newVal.url);
              }
            }
          }
        },
        beforeDestroy() {
          if(this.cropperInitiated === true) {
            this.__cropper.cropper('destroy');
          }
        }
      });
    }
  };
</script>
