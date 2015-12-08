<template>
  <div class="row">
    <div class="col-lg-12">
      <navbar :show="show" :auth="store.auth" :connection="store.connection" @logout="logout"></navbar>

      <div class="row">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import notie from 'notie';
  import reduxMixin from './../mixins/redux.babel';
  import { logout } from './../redux/actions/auth.babel';
  import { PURGE } from './../redux/actions/api.babel';
  import { DEFAULT_NON_AUTH_PATH_NAME } from './../config.babel';
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
          logout().then(() => {
            PURGE().
              then(() => this.$route.router.go({name: DEFAULT_NON_AUTH_PATH_NAME}));
          });
        });
      }
    },
    components: {
      navbar
    }
  };
</script>
