import React from 'react';
import {Link, RouteHandler} from 'react-router';

export default class Condor extends React.Component {
  render() {
    return (
      <div>
        <p>this is root</p>
        <ul>
          <li><Link to='users'>users</Link></li>
          <li><Link to='login'>login</Link></li>
        </ul>

        <RouteHandler {...this.props} />
      </div>
    );
  }
};
