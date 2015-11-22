<template>
  <div class="row">
    <div class="col-lg-12">
      <navbar :show="show" :auth="store.auth" @logout="logout"></navbar>

      <div class="row">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import notie from 'notie';
  import reduxMixin from './../mixins/redux.vue';
  import {logout} from './../redux/actions/auth.vue';
  import navbar from './navbar.vue';

  export default {
    mixins: [reduxMixin],
    name: 'app',
    computed: {
      show() {
        return (this.store && this.store.auth && this.store.auth.jwt) === undefined ? false : true;
      }
    },
    methods: {
      logout() {
        notie.confirm('Are you sure you want to logout?', 'Yes', 'Cancel', () => {
          logout().then(() => this.$route.router.go({name: 'landing'}));
        });
      }
    },
    components: {
      navbar
    }
  };
</script>
