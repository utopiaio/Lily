import React from 'react';
import Router, {DefaultRoute, Route, NotFoundRoute} from 'react-router';
import Login from './components/login.6.babel.js';
import Users from './components/users.6.babel.js';
import UserDetail from './components/userDetail.6.babel.js';
import NotFound from './components/notFound.6.babel.js';
import Condor from './components/condor.6.babel.js';

let routes = (
  <Route name='root' path='/' handler={Condor}>
    <Route name='users' path='/users' handler={Users}></Route>
    <Route name='user-detail' path='/users/:id' handler={UserDetail} />
    <Route name='login' path='/login' handler={Login} />
    <DefaultRoute handler={Login} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  let params = state.params;
  React.render(<Handler params={params} />, document.querySelector('#condor'));
});
