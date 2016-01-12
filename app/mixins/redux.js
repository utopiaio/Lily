import { store } from './../redux/store';

/*
 * props mixin that gets the store from parent
 */
const props = {
  props: {
    store: {
      type: Object,
      required: true,
      twoWay: false,
      default() {return {};}
    }
  }
};

exports.props = props;
