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
      <div class="col-lg-6">
        <document-upload class="btn btn-secondary btn-block" :model.sync="image" url="http://rock.io/S3" accept="image/*" :auth-key="authKey" :jwt="store.auth.jwt"></document-upload>
      </div>

      <div class="col-lg-6">
        <document-upload class="btn btn-secondary btn-block" :model.sync="images" url="http://rock.io/S3" :multiple="true" :auth-key="authKey" :jwt="store.auth.jwt"></document-upload>
      </div>
    </div>

    <h3>Image Crop</h3>
    <div class="row">
      <div class="col-lg-6">
        <image-crop :src.sync="image" :x="16" :y="9" type="image/jpeg" :quality="0.6" url="http://rock.io/S3" :auth-key="authKey" :jwt="store.auth.jwt"></image-crop>
      </div>

      <div class="col-lg-6">
        <div v-for="i in images" track-by="$index">
          <document-info :src="images[$index]" :auth-key="authKey" :jwt="store.auth.jwt" @deleted="deleted"></document-info>
        </div>
      </div>
    </div>

    <h3>Trix</h3>
    <div class="row">
      <div class="col-lg-6">
        <trix :model.sync="trixOne"></trix>
      </div>

      <div class="col-lg-6">
        <trix :model.sync="trixTwo"></trix>
      </div>
    </div>

    <h3>Select 2</h3>
    <div class="row">
      <div class="col-lg-6">
        <select2 class="form-control input-lg" :model.sync="select" multiple>
          <option v-for="option in select2Data" track-by="$index" value="{{ option.id }}" v-text="option.text"></option>
        </select2>
      </div>

      <div class="col-lg-6">
        <select2 class="form-control input-lg" :model.sync="select" multiple>
          <option v-for="option in select2Data" track-by="$index" value="{{ option.id }}" v-text="option.text"></option>
        </select2>
      </div>
    </div>

    <pre>{{ $data | json }}</pre>
  </div>
</template>

<script>
  import { API_AUTH_HEADER } from './../config';
  import { props } from './../mixins/redux';

  module.exports = {
    name: 'components',
    mixins: [props],
    data() {
      return {
        select: [0, 1],
        select2Data: [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }],
        authKey: API_AUTH_HEADER,
        date: '1991-08-09',
        time: '18:00',
        dateTime: '',
        documentMultiple: [],
        documentSingle: {},
        trixOne: '<b>hello</b>',
        trixTwo: '',
        image: {},
        images: []
      };
    },
    methods: {
      deleted(deletedFile) {
        console.log(deletedFile);
      }
    }
  };
</script>
