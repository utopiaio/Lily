import React from 'react';

class UserDetail extends React.Component {
  render() {
    return(
      <div>
        <p>user detail... for {this.props.params.id}</p>
      </div>
    );
  }
}

UserDetail.contextTypes = {
  router: React.PropTypes.func
};

export default UserDetail;
