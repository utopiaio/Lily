;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .config(Config);

  Config.$inject = ['$sceDelegateProvider', '$routeProvider', '$locationProvider', 'AuthProvider', 'BackdropProvider'];

  function Config($sceDelegateProvider, $routeProvider, $locationProvider, AuthProvider, BackdropProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/home.html',
        controller: 'HomeController',
        controllerAs: 'home',
        resolve: {
          authorized: AuthProvider.authorized
        }
      })
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .when('/test', {
        templateUrl: 'app/views/test.html',
        controller: 'TestController',
        controllerAs: 'test'
      })
      .otherwise({
        redirectTo: '/login'
      });

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://admin*.rock.io/**'
    ]);

    AuthProvider.config({
      url: 'http://rock.io/authenticate',
      key: 'rock'
    });

    BackdropProvider.config(3000);

    // $locationProvider.html5Mode(true);
  }
})(window.angular);
