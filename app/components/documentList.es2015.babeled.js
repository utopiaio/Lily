'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @module documentList
 * this is a soft wrapper for document info component with delete method
 *
 * usage:
 * <document-list :src.sync="documentList"></document-info>
 */

module.exports = {
  install: function install(Vue, options) {
    Vue.component('documentList', {
      name: 'documentList',
      props: {
        src: {
          required: true,
          twoWay: true
        }
      },
      template: '\n        <div>\n          <div class="row" v-if="multiple === true">\n            <document-info v-for="document in src" track-by="$index" :src="document" @deleted="deleted" class="col-lg-4 col-md-6"></document-info>\n          </div>\n          <document-info v-if="multiple === false" :src="src" @deleted="deleted"></document-info>\n        </div>\n      ',
      computed: {
        /**
         * we're computing `multiple` because we can't access `this`
         * inside of props before initialization
         */

        multiple: function multiple() {
          return Array.isArray(this.src);
        }
      },
      methods: {
        deleted: function deleted(doc) {
          if (this.multiple === false) {
            this.src = {};
          } else {
            for (var i = this.src.length - 1; i >= 0; i--) {
              if (this.src[i].id === doc.id) {
                this.src = [].concat(_toConsumableArray(this.src.slice(0, i)), _toConsumableArray(this.src.slice(i + 1)));
                break;
              }
            };
          }
        }
      }
    });
  }
};