<template>
  <div>
    <h1>one</h1>
    <button class="btn btn-default" @click="get">get</button>
    <button class="btn btn-default" @click="query">query</button>
    <button class="btn btn-default" @click="post">post</button>
    <button class="btn btn-default" @click="put">put</button>
    <button class="btn btn-default" @click="delete">delete</button>
    <button class="btn btn-default" @click="update">update auth</button>
    <pre>{{ $data.store | json }}</pre>
  </div>
</template>

<script>
  import { props } from './../mixins/redux';
  import { API_TABLES } from './../config';
  import { GET, POST, PUT, DELETE } from './../redux/actions/api';
  import { update } from './../redux/actions/auth';

  module.exports = {
    name: 'one',
    mixins: [props],
    methods: {
      get() {
        GET(API_TABLES.TAGS, 73, true); // force GET fetch from server
      },
      query() {
        GET(API_TABLES.TAGS, undefined, true); // force query fetch from server
      },
      post() {
        POST(API_TABLES.TAGS, {tag: String(new Date().getTime())});
      },
      put() {
        PUT(API_TABLES.TAGS, {id: 186, tag: '_BOOM!_XXX'});
      },
      delete() {
        DELETE(API_TABLES.TAGS, {id: 157});
      },
      update() {
        update();
      }
    }
  };
</script>
