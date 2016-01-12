<template>
  <div class="row">
    <div class="col-lg-12">
      <navbar :show="show" :auth="store.auth" :connection="store.connection" @logout="logout"></navbar>

      <div class="row">
        <router-view :store="store"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import notie from 'notie';
  import { redux } from './../redux/store';
  import { API_TABLES } from './../config';
  import { GET, POST, PUT, DELETE } from './../redux/actions/api';
  import { logout } from './../redux/actions/auth';
  import { DEFAULT_NON_AUTH_PATH_NAME } from './../config';
  import navbar from './navbar.vue';

  module.exports = {
    name: 'app',
    computed: {
      show() {
        return (redux.state && redux.state.auth && redux.state.auth.jwt) === undefined ? false : true;
      },

      store() {
        return redux.state;
      }
    },
    methods: {
      logout() {
        notie.confirm('Are you sure you want to logout?', 'Yes', 'Cancel', () => {
          logout().then(() => {
              this.$route.router.go({name: DEFAULT_NON_AUTH_PATH_NAME});
          });
        });
      }
    },
    components: {
      navbar
    }
  };
</script>
