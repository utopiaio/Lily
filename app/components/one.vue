<template>
  <div>
    <h1>one</h1>
    <button class="btn btn-secondary" @click="get">get</button>
    <button class="btn btn-secondary" @click="query">query</button>
    <button class="btn btn-secondary" @click="post">post</button>
    <button class="btn btn-secondary" @click="patch">patch</button>
    <button class="btn btn-secondary" @click="delete">delete</button>
    <button class="btn btn-secondary" @click="update">update auth</button>
    <pre>{{ $data.store | json }}</pre>
  </div>
</template>

<script>
  import { props } from './../mixins/redux';
  import { API_TABLES } from './../config';
  import { GET, POST, PATCH, DELETE } from './../redux/actions/api';
  import { update } from './../redux/actions/auth';

  module.exports = {
    name: 'one',
    mixins: [props],
    methods: {
      get() {
        GET(API_TABLES.TAG, 73, true); // force GET fetch from server
      },
      query() {
        GET(API_TABLES.TAG, undefined, true); // force query fetch from server
      },
      post() {
        POST(API_TABLES.TAG, {tag: String(new Date().getTime())});
      },
      patch() {
        PATCH(API_TABLES.TAG, {id: 186, tag: '_BOOM!_XXX'});
      },
      delete() {
        DELETE(API_TABLES.TAG, {id: 157});
      },
      update() {
        update();
      }
    }
  };
</script>
