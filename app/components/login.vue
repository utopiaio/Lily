<style lang="less" scoped>
  @import "./../less/variables.less";

  .login-form {
    margin-top: 72px;
    margin-bottom: 64px;
    padding: 24px 24px 32px 24px;
    border-radius: 4px;
    background-color: #ecf0f1;
    border: 1px solid #95a5a6;
    -webkit-box-shadow: 0 2px 4px rgba(51, 51, 51, 0.5);
    -moz-box-shadow: 0 2px 4px rgba(51, 51, 51, 0.5);
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.5);

    img {
      display: inline-block;
      width: 64px;
    }

    button[type="submit"] {
      margin-top: 24px;
    }

    @media(max-width: @screen-sm) {
      margin-top: 32px;
      margin-bottom: 32px;
    }
  }
</style>

<template>
  <div class="col-lg-12">
    <!-- container -->
    <div class="container">
      <div class="row">
        <div class="col-lg-offset-3 col-md-offset-2 col-lg-6 col-md-8">
          <div class="row">
            <form class="login-form col-lg-offset-3 col-md-offset-3 col-lg-6 col-md-6" @submit.prevent="login" novalidate>
              <div class="form-group text-center">
                <img class="img-responsive" alt="logo" src="./../../static/images/condor.png" />
              </div>

              <div class="form-group">
                <label class="control-label" for="username">Username *</label>
                <input type="text" class="form-control input-lg" id="username" name="username" v-model="credentials.username" required />
              </div>

              <div class="form-group">
                <label class="control-label" for="password">Password *</label>
                <input type="password" class="form-control input-lg" id="password" name="password" v-model="credentials.password" required />
              </div>

              <button type="submit" class="btn btn-default btn-block btn-lg" v-disabled="invalid">login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- ./ container -->
  </div>
</template>

<script>
  import notie from 'notie';
  import reduxMixin from './../mixins/redux.vue';
  import {DEFAULT_AUTH_PATH_NAME, NOTY_INFO} from './../config.vue';
  import {login} from './../redux/actions/auth.vue';

  export default {
    name: 'login',
    mixins: [reduxMixin],
    data() {
      return {
        credentials: {
          username: '',
          password: ''
        }
      };
    },
    computed: {
      invalid() {
        if(this.credentials.username.length < 3 || this.credentials.password.length < 3) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      login() {
        login(this.credentials)
          .then((authInfo) => {
            notie.alert(4, `Welcome back ${authInfo.user.user_full_name}`, NOTY_INFO);
            this.$route.router.replace({name: DEFAULT_AUTH_PATH_NAME});
          })
          .catch((error) => {
            notie.alert(3, String(error).replace(/error\: /i, ''), 2.5);
          });
      }
    }
  };
</script>
