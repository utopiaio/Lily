'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _cropper = require('cropper');

var _cropper2 = _interopRequireDefault(_cropper);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  install: function install(Vue, options) {
    // as the canvas `toBlob` API is only available on Mozila we're using a polyfill (from MDN)
    function _toBlob(canvas, callback, type, quality) {
      try {
        type = type || 'image/jpeg';
        quality = quality || 0.6;

        var _binaryString = atob(canvas.toDataURL(type, quality).split(',')[1]);
        var _length = _binaryString.length;
        var _array = new Uint8Array(_length);

        for (var i = 0; i < _length; i++) {
          _array[i] = _binaryString.charCodeAt(i);
        }

        callback(null, new Blob([_array], { type: type }));
      } catch (err) {
        callback(err, null);
      }
    }

    Vue.component('imageCrop', {
      props: {
        src: {
          type: Object,
          required: true,
          twoWay: true,
          default: function _default() {
            return {};
          }
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
      data: function data() {
        return {
          cropped: false,
          cropperInitiated: false,
          selfMutated: false
        };
      },

      template: '\n        <div>\n          <img v-if="src.url" class="img-responsive" :src="src.url">\n          <p style="margin-top: 8px;" v-if="!cropped">\n            <button v-if="src.url" @click="crop" class="btn btn-default btn-block"><i class="fa fa-crop"></i>&nbsp;&nbsp;Crop</button>\n          </p>\n        </div>',
      ready: function ready() {
        if (this.src.hasOwnProperty('type') === true && this.src.type.search(/image/) > -1) {
          this.initiateCropper();
        }
      },

      methods: {
        /**
         * crop
         * deletes previous image
         * uploads the new cropped image and updates the src
         */

        crop: function crop() {
          var _this = this;

          (0, _jquery2.default)('button', this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropping...';
          (0, _jquery2.default)('button', this.$el)[0].setAttribute('disabled', 'disabled');
          this.__previousSrc = this.src;

          // uploading the new cropped image & destroying the cropper (if successful)
          _toBlob((0, _jquery2.default)(this.__image).cropper('getCroppedCanvas'), function (err, blob) {
            if (err === null) {
              var formData = new FormData();
              formData.append('files[]', blob);

              _superagent2.default.post(_this.url).send(formData).end(function (error, response) {
                (0, _jquery2.default)('button', _this.$el)[0].removeAttribute('disabled');

                if (response && response.ok === true) {
                  (0, _jquery2.default)('button', _this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;Cropped';
                  _this.setMutationFlag();
                  _this.src = response.body.files[0];
                  _this.cropped = true;
                  _this.__cropper.cropper('destroy');
                  _this.cropperInitiated = false;

                  // deleting previous image...
                  _superagent2.default.del(_this.__previousSrc.deleteUrl).end(function (error, response) {
                    if (response && response.ok === true) {
                      console.info('Previous file deleted succsufully.');
                    } else {
                      console.warn('Unable to delete previous file.');
                    }
                  });
                } else {
                  (0, _jquery2.default)('button', _this.$el)[0].innerHTML = '<i class="fa fa-crop"></i>&nbsp;&nbsp;<span class="text-danger">Error Cropping</span>';
                }
              });
            } else {
              // there was no image to crop in the fist place - image deleted maybe
              _this.cropped = true; // hide the crop button
            }
          }, this.type, this.quality);
        },

        /**
         * initiates cropper (and sets to __cropper)
         * also sets `__image`
         */
        initiateCropper: function initiateCropper() {
          this.cropperInitiated = true;
          this.__image = (0, _jquery2.default)('img', this.$el)[0];
          this.__cropper = (0, _jquery2.default)(this.__image).cropper({
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
        setMutationFlag: function setMutationFlag() {
          var _this2 = this;

          this.selfMutated = true;
          var _selfie = setTimeout(function () {
            _this2.selfMutated = false;
            clearTimeout(_selfie);
          }, 125);
        }
      },
      watch: {
        src: function src(newVal, oldVal) {
          var _this3 = this;

          if (newVal.hasOwnProperty('type') === true && newVal.type.search(/image/) > -1) {
            if (this.cropperInitiated === false && this.selfMutated === false) {
              // the timeout is required so that the DOM will be ready
              // otherwise cropper will not be properly initiated
              setTimeout(function () {
                _this3.cropped = false;
                _this3.setMutationFlag();
                _this3.initiateCropper();
              }, 125);
            } else if (this.cropperInitiated === true && this.selfMutated === false) {
              // reinitializing the cropper...
              this.cropped = false;
              this.setMutationFlag();
              this.__cropper.cropper('replace', newVal.url);
            }
          }
        }
      },
      beforeDestroy: function beforeDestroy() {
        if (this.cropperInitiated === true) {
          this.__cropper.cropper('destroy');
        }
      }
    });
  }
}; /**
    * @module: imageCrop
    * a Vue component that initiates cropper on an image file upload
    *
    * usage:
    * <image-crop :src.sync="image" :x="16" :y="9" type="image/jpeg" :quality="0.6" url="http://rock.io/S3"></image-crop>
    */