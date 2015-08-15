;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .run(Run);

  Run.$inject = ['$rootScope', '$location', 'Noty'];

  function Run($rootScope, $location, Noty) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {});

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {});

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      switch(rejection.code) {
        // auth key not found
        case -1:
          Noty.error('Please login first');
        break;
      }
    });
  }
})(window.angular);
