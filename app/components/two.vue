<template>
  <div>
    <h1>two</h1>
    <pre>{{ tag | json }}</pre>
  </div>
</template>

<script>
  import { redux } from './../redux/store';

  module.exports = {
    name: 'two',
    computed: {
      tag() {
        return redux.state.API.tag;
      }
    }
  };
</script>
