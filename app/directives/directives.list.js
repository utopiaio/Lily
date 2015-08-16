/**
 * summernote
 * <summernote ng-model="wysiwyg" config="{height: 300,toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']],['view', ['fullscreen']]]}" />
 * search for `.css({display:"",width:Math.min(a.width(),b.width())` inside the summernote.min.js and add `margin: "16px"` property
 *
 * calendar
 * <calendar ng-model="model" data-mode="time|date" data-* />
 *
 * image
 * <image-file ng-model="image" multiple required />
 *
 * document
 * <document ng-model="document" name="document" upload-url="@" multiple required />
 *
 * image-list
 * as the name suggests, works for only multiple `image-file`
 * <image-list src="images" x="x" y="y" />
 *
 * crop
 * <crop src="image" x="16" y="9" />
 *
 * document-list
 * NOTE:
 * `cleared` to [] and '' so be sure to act accordingly on form validation
 * <document-list src="files" />
 */
