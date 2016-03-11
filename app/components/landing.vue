<template>
  <div class="col-lg-12">
    <h1>this is the landing page, public to anyone who wants to see</h1>
    <a v-link="{name: 'login'}">login</a>
  </div>
</template>

<script>
  module.exports = {
    name: 'landing'
  };
</script>
