;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$location', 'Auth'];

  function LogoutController($location, Auth) {
    Auth
      .logout()
      .then(function() {
        $location.path('/login');
      });
  }
})(window.angular);
