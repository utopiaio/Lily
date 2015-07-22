import React from 'react';
import {State} from 'react-router';

let MyMixin = {
  componentDidMount() {
    console.log('component mounted [via Mixin]');
  },

  boundToThis() {
    console.log('you can also call me via `this`');
    return true;
  }
};

const NotFound = React.createClass({
  mixins: [State, MyMixin],

  render() {
    let pathName = this.getPathname();
    console.log(this.boundToThis());

    return(
      <div>URL `<code>{pathName}</code>` not found</div>
    );
  }
});

export default NotFound;
