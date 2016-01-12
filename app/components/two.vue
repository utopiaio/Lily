<template>
  <div>
    <h1>two</h1>
    <pre>{{ tags | json }}</pre>
  </div>
</template>

<script>
  import { redux } from './../redux/store';

  module.exports = {
    name: 'two',
    computed: {
      tags() {
        return redux.state.API.tags;
      }
    }
  };
</script>
