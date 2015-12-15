require('font-awesome/css/font-awesome.min.css');
require('bootstrap/dist/css/bootstrap.min.css');
require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
require('cropperjs/dist/cropper.min.css');
require('trix/dist/trix.css');
require('./app/less/app.less');

var Vue = require('vue');
var VueRouter = require('vue-router');
var notie = require('notie');

var CONFIG = require('./app/config');
var disabled = require('./app/lily/disabled');
var dateTime = require('./app/lily/dateTime');
var documentUpload = require('./app/lily/documentUpload');
var documentInfo = require('./app/lily/documentInfo');
var imageCrop = require('./app/lily/imageCrop');
var trix = require('./app/lily/trix');
var tooltip = require('./app/lily/tooltip');

var app = require('./app/components/app.vue');
var one = require('./app/components/one.vue');
var two = require('./app/components/two.vue');
var landing = require('./app/components/landing.vue');
var login = require('./app/components/login.vue');
var components = require('./app/components/components.vue');

var auth = require('./app/redux/actions/auth');
var API = require('./app/redux/actions/api');
var connection = require('./app/redux/actions/connection');
var store = require('./app/redux/store');

Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(disabled);
Vue.use(dateTime);
Vue.use(documentUpload);
Vue.use(documentInfo);
Vue.use(imageCrop);
Vue.use(trix);
Vue.use(tooltip);

var router = new VueRouter({
  // history: true,
  history: false,
  hashbang: false,
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

/**
 * this is what's happening on each beforeEach call
 *
 * - next transition to is not available
 *   > if auth is existent, transition is redirected to default auth page
 *   > if auth doesn't exist, transition is redirected to default non-auth page
 * - next transition has auth property, auth key is checked and is set to TRUE
 *   > if existent, you shall pass
 *   > if auth doesn't exist, you shall not pass
 * - no auth required, just pass through
 */
router.beforeEach(function(transition) {
  // which will call the appropriate Auth function and redirect if necessary.
  // either way, the default page is `landing` component
  if(transition.to.matched === null) {
    // unmatched url has been entered, instead of having a "blank" page we'll
    // redirect to appropriate component
    var _state = store.getState();

    if(_state.auth && _state.auth.jwt) {
      // redirect to default auth page
      transition.redirect({name: CONFIG.DEFAULT_AUTH_PATH_NAME});
    } else {
      // redirect to default non-auth page
      transition.redirect({name: CONFIG.DEFAULT_NON_AUTH_PATH_NAME});
    }
  } else {
    if(transition.to.auth === true) {
      // authorization is required
      var _state = store.getState();

      if(_state.auth && _state.auth.jwt) {
        // all checks out, proceed to next path
        transition.next();
      } else {
        // no auth found, redirecting to login page
        notie.alert(2, 'Please login first', CONFIG.NOTY_WARN);
        transition.redirect({name: CONFIG.LOGIN_PATH_NAME});
      }
    } else if(transition.to.auth === false) {
      // authorized view is NOT allowed
      var _state = store.getState();

      if(_state.auth && _state.auth.jwt) {
        // redirect to default auth-ed view
        transition.redirect({name: CONFIG.DEFAULT_AUTH_PATH_NAME});
      } else {
        transition.next();
      }
    } else {
      // no preconditions, moving along...
      transition.next();
    }
  }
});

// initiating auth before we start the router
API.init().then(() => {
  auth.init().then(function() {
    auth.update().catch((error) => {
      console.warn(error);
    });
    router.start(Vue.extend({}), '#app');
  }).catch(function(error) {
    console.info('router started with no Auth');
    router.start(Vue.extend({}), '#app');
  });
});
