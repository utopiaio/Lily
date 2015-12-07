<script>
  /**
   * @module summoernote
   * summernote component - basic initiation, destroy and update on change
   *
   * usage:
   * <summernote :model.sync="model"></summernote>
   * <summernote :model.sync="model" :options="{height: 300, toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']]]}"></summernote>
   */
  import $ from 'jquery';
  import bootstrap from 'bootstrap';
  import summernote from 'summernote';

  module.exports = {
    install(Vue, options) {
      Vue.component('summernote', {
        props: {
          model: {
            type: String,
            required: true,
            twoWay: true,
            default: ''
          },
          options: {
            type: Object,
            required: false,
            twoWay: false,
            default() { return {height: 300,toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']],['view', ['fullscreen']]]}; }
          }
        },
        template: `<div></div>`,
        ready() {
          this.__summernote = $(this.$el).summernote(this.options);
          this.__summernote.code(this.model);
          this.__summernote.on('summernote.change', (customEvent, contents, $editable) => {
            this.model = contents;
          });
        },
        beforeDestroy() {
          this.__summernote.destroy();
        },
        watch: {
          // watching for external changes
          model(newVal, oldVal) {
            this.__summernote.code(newVal);
          }
        }
      });
    }
  };
</script>
