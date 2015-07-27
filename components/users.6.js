import React from 'react';
import {Link} from 'react-router';

export default class Users extends React.Component {
  render() {
    return (
      <div>
        <p>users list...</p>
        <Link to="user-detail" params={{id: 12}}>click me if you dare</Link>
      </div>
    );
  }
};
