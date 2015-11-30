<script>
  import {createStore, combineReducers} from 'redux';
  import auth from './reducers/auth.vue';
  import API from './reducers/api.vue';

  module.exports = createStore(combineReducers({auth, API}));
</script>



