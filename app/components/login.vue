<style lang="less" scoped>
  @import "./../less/variables.less";

  .login-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
        -ms-flex-pack: center;
            justify-content: center;
    min-height: 100vh;

    form.login-form {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -webkit-flex-direction: column;
          -ms-flex-direction: column;
              flex-direction: column;
      -webkit-box-align: center;
      -webkit-align-items: center;
          -ms-flex-align: center;
              align-items: center;
      padding: 32px 16px;
      width: 250px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 6px;
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.5);
      background-color: #ecf0f1;

      img.logo {
        height: 75px;
        width: auto;
        margin-bottom: 16px;
      }

      label {
        -webkit-align-self: flex-start;
            -ms-flex-item-align: start;
                align-self: flex-start;
      }

      input {
        margin-bottom: 16px;
      }

      button[type="submit"] {
        margin-top: 16px;
      }

      @media(max-width: @screen-sm) {
        width: 90%;
      }
    }
  }
</style>

<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="login" novalidate>
      <img class="logo" alt="logo" src="./../../static/images/condor.png" />

      <label class="control-label" for="username">Username *</label>
      <input
        type="text"
        class="form-control input-lg"
        id="username"
        name="username"
        v-model="credentials.username"
        required />

      <label class="control-label" for="password">Password *</label>
      <input
        type="password"
        class="form-control input-lg"
        id="password"
        name="password"
        v-model="credentials.password"
        required />

      <button
        type="submit"
        class="btn btn-success btn-block btn-lg"
        v-disabled="invalid"><i class="fa fa-sign-in"></i>&nbsp;&nbsp;login</button>
    </form>
  </div>
</template>

<script>
  import notie from 'notie';
  import { DEFAULT_AUTH_PATH_NAME, NOTY_INFO } from './../config';
  import { login } from './../redux/actions/auth';

  module.exports = {
    name: 'login',
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
