import React from 'react';
import credentialAction from '../actions/credentialAction.6.babel.js';
import credentailStore from '../stores/credentialStore.6.babel.js';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {one: 1};
  }

  componentWillMount() {
    // if(credentailStore.credentials() === null) {
    //   this.context.router.transitionTo('/login');
    // }
  }

  componentDidMount() {
    credentailStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    credentailStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState({one: ++this.state.one});
  }

  send() {
    credentialAction.login({username: 'moe', password: 'moe@23'});
  }

  render() {
    return(
      <div>
        <pre>{this.state.one}</pre>
        <p>user detail... for {this.props.params.id}</p>
        <button onClick={this.send.bind(this)}>click me if you dare!</button>
      </div>
    );
  }
}

UserDetail.contextTypes = {
  router: React.PropTypes.func
};

export default UserDetail;
