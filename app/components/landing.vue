<template>
  <div>
    <h1>this is the landing page, public to anyone who wants to see</h1>
    <a v-link="{name: 'login'}">login</a>
  </div>
</template>

<script>
  export default {
    name: 'landing'
  };
</script>
