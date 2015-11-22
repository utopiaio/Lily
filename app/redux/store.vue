<script>
  import {createStore, combineReducers} from 'redux';
  import auth from './reducers/auth.vue';

  export default createStore(combineReducers({auth}));
</script>
