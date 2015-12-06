<template>
  <div>
    <h1>one</h1>
    <button class="btn btn-default" @click="get">get</button>
    <button class="btn btn-default" @click="query">query</button>
    <button class="btn btn-default" @click="post">post</button>
    <button class="btn btn-default" @click="put">put</button>
    <button class="btn btn-default" @click="delete">delete</button>
    <pre>{{ $data.store.API | json }}</pre>
  </div>
</template>

<script>
  import reduxMixin from './../mixins/redux.babel';
  import {API_TABLES} from './../config.babel';
  import {GET, POST, PUT, DELETE} from './../redux/actions/api.babel';

  module.exports = {
    name: 'one',
    mixins: [reduxMixin],
    methods: {
      get() {
        GET(API_TABLES.TAGS, 73, true); // force GET fetch from server
      },
      query() {
        GET(API_TABLES.TAGS, undefined, true); // force query fetch from server
        GET(API_TABLES.TAGS, undefined, false); // fetch only if store is empty (default)
      },
      post() {
        POST(API_TABLES.TAGS, {tag: 'that shit cray'});
      },
      put() {
        PUT(API_TABLES.TAGS, {id: 157, tag: '_BOOM!_XXX'});
      },
      delete() {
        DELETE(API_TABLES.TAGS, {id: 157});
      }
    }
  };
</script>
