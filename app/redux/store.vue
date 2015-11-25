<script>
  import {createStore, combineReducers} from 'redux';
  import auth from './reducers/auth.vue';

  module.exports = createStore(combineReducers({auth}));
</script>



