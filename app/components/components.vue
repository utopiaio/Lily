<template>
  <div class="col-lg-12">
    <h2>components</h2>

    <hr>

    <h3>date-time</h3>
    <div class="row">
      <div class="col-lg-3">
        <date-time format="HH:mm" class="form-control" :model.sync="time"></date-time>
      </div>

      <div class="col-lg-3">
        <date-time format="HH:mm" class="form-control" :model.sync="time"></date-time>
      </div>

      <div class="col-lg-3">
        <date-time format="YYYY-MM-DD" class="form-control" :model.sync="date"></date-time>
      </div>

      <div class="col-lg-3">
        <date-time format="YYYY-MM-DD hh:mm A" class="form-control" :model.sync="dateTime"></date-time>
      </div>
    </div>

    <h3>document upload</h3>
    <div class="row">
      <div class="col-lg-3">
        <document-upload class="btn btn-default btn-block" :model.sync="documentMultiple" :multiple="true" accept="image/*" url="http://rock.io/S3"></document-upload>
      </div>

      <div class="col-lg-3">
        <document-upload class="btn btn-default btn-block" :model.sync="documentSingle" accept="image/*" url="http://rock.io/S3"></document-upload>
      </div>
    </div>

    <h3>document list</h3>
    <div class="row">
      <div class="col-lg-6">
        <document-list :src.sync="documentMultiple"></document-info>
      </div>

      <div class="col-lg-6">
        <document-list :src.sync="documentSingle"></document-info>
      </div>
    </div>

    <h3>summernote</h3>
    <div class="row">
      <div class="col-lg-6">
        <summernote :model.sync="summernoteOne"></summernote>
      </div>

      <div class="col-lg-6">
        <summernote :model.sync="summernoteTwo" :options="{height: 300, toolbar: [['style', ['style']],['font', ['bold', 'italic', 'underline']],['fontsize', ['fontsize']],['color', ['color']],['para', ['ul', 'ol', 'paragraph']],['height', ['height']],['table', ['table']],['insert', ['link', 'picture', 'hr']]]}"></summernote>
      </div>
    </div>

    <h3>Image Crop</h3>
    <div class="row">
      <div class="col-lg-3">
        <document-upload class="btn btn-default btn-block" :model.sync="image" accept="image/*" url="http://rock.io/S3"></document-upload>
      </div>

      <div class="col-lg-3">
        <img class="img-responsive" :src="image.url">
      </div>

      <div class="col-lg-6">
        <image-crop :src.sync="image" :x="16" :y="9" type="image/jpeg" :quality="0.6" url="http://rock.io/S3"></image-crop>
      </div>
    </div>

    <pre>{{ $data | json }}</pre>
  </div>
</template>

<script>
  export default {
    name: 'components',
    data() {
      return {
        date: '1991-08-09',
        time: '18:00',
        dateTime: '',
        documentMultiple: [],
        documentSingle: {},
        summernoteOne: '<b>hello</b>',
        summernoteTwo: '',
        image: {}
      };
    }
  };
</script>
