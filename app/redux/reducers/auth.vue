<script>
  import {AUTH_LOGIN, AUTH_LOGOUT, AUTH_UPDATE} from './../constants/constants.vue';

  function Auth(state = {}, action) {
    switch(action.type) {
      case AUTH_LOGIN:
        return action.auth;
      break;

      case AUTH_UPDATE:
        return Object.assign({}, state, action.auth);
      break;

      case AUTH_LOGOUT:
        return {};
      break;

      default:
        return state;
      break;
    }
  }

  export default Auth;
</script>
