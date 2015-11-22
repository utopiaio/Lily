var Vue = require('vue');
var VueRouter = require('vue-router');
var notie = require('notie');
var disabled = require('./app/directives/disabled.vue');
var app = require('./app/components/app.vue');
var one = require('./app/components/one.vue');
var two = require('./app/components/two.vue');
var landing = require('./app/components/landing.vue');
var login = require('./app/components/login.vue');
var components = require('./app/components/components.vue');
var dateTime = require('./app/components/dateTime.vue');
var documentUpload = require('./app/components/documentUpload.vue');
var documentInfo = require('./app/components/documentInfo.vue');
var documentList = require('./app/components/documentList.vue');
var summernote = require('./app/components/summernote.vue');
var auth = require('./app/redux/actions/auth.vue');
var store = require('./app/redux/store.vue');

Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(disabled);
Vue.use(dateTime);
Vue.use(documentUpload);
Vue.use(documentInfo);
Vue.use(documentList);
Vue.use(summernote);

var router = new VueRouter({
  hashbang: false,
  history: true,
  linkActiveClass: 'v-link-active',
  saveScrollPosition: false,
  transitionOnLoad: false
});

router.map({
  '/': {
    name: 'root',
    component: app,
    subRoutes: {
      '/': {
        name: 'landing',
        component: landing,
        auth: false
      },
      '/login': {
        name: 'login',
        component: login,
        auth: false
      },
      '/one': {
        name: 'one',
        component: one,
        auth: true
      },
      '/two': {
        name: 'two',
        component: two
      },
      '/components': {
        name: 'components',
        component: components
      }
    }
  }
});

router.beforeEach(function(transition) {
  // which will call the appropriate Auth function and redirect if necessary.
  // either way, the default page is `landing` component
  if(transition.to.matched === null) {
    // unmatched url has been entered, instead of having a "blank" page we'll
    // redirect to appropriate component
    var _state = store.getState();

    if(_state.auth && _state.auth.jwt) { // redirect to default auth page
      transition.redirect({name: 'one'});
    } else { // redirect to default non-auth page
      transition.redirect({name: 'landing'});
    }
  } else {
    if(transition.to.auth === true) { // authorization is required
      var _state = store.getState();

      if(_state.auth && _state.auth.jwt) {
        transition.next();
      } else {
        notie.alert(2, 'Please login first', 2);
        transition.redirect({name: 'login'});
      }
    } else if(transition.to.auth === false) { // authorized view is NOT allowed
      var _state = store.getState();

      if(_state.auth && _state.auth.jwt) { // redirect to default auth-ed view
        transition.redirect({name: 'one'});
      } else {
        transition.next();
      }
    } else { // no preconditions, moving along...
      transition.next();
    }
  }
});

// initiating auth before we start the router
auth.init().then(function() {
  router.start(Vue.extend({}), '#app');
}).catch(function(error) {
  console.info('router started with no Auth');
  router.start(Vue.extend({}), '#app');
});
