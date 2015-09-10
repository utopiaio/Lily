/**
 * summernote
 * <summernote ng-model="wysiwyg" config="{height: 300,toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']],['view', ['fullscreen']]]}" />
 * search for `.css({display:"",width:Math.min(a.width(),b.width())` inside the summernote.min.js and add `margin: "16px"` property
 *
 * calendar
 * module: `condor.calendar`
 * <calendar ng-model="model" data-mode="time|date" data-* />
 *
 * document
 * module: `condor.document`
 * <condor-document-upload ng-model="document" upload-url="@" multiple required />
 * <condor-document src="file" />
 * <condor-document-list src="files" />
 *
 * image
 * module: `condor.image`
 * <condor-image-upload ng-model="image" required multiple />
 * <condor-image-list src="images" x="16" y="9" upload-url="url" type="type" />
 * <condor-image src="image" x="16" y="9" upload-url="url" type="type" quality="0.6" />
 */
