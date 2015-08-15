/**
 * summernote
 * <summernote ng-model="wysiwyg" config="{height: 300,toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']],['view', ['fullscreen']]]}" />
 * search for `.css({display:"",width:Math.min(a.width(),b.width())` inside the summernote.min.js and add `margin: "16px"` property
 *
 * calendar
 * <calendar ng-model="model" />
 *
 * image
 * <image-file ng-model="image" multiple />
 *
 * document
 * <document ng-model="document" name="document" upload-url="@" multiple required />
 *
 * image-display
 * <image-list src="images" />
 *
 * crop
 * <crop src="image" />
 *
 * document-list
 * NOTE:
 * `cleared` to [] and '' so be sure to act accordingly on form validation
 * <document-list src="files" />
 */
