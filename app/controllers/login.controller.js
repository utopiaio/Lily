;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'Auth', 'Noty'];

  function LoginController($location, Auth, Noty) {
    var vm = this;

    vm.credentials = {
      username: '',
      password: ''
    };

    vm.login = function() {
      Auth
        .login(vm.credentials)
        .then(function(info) {
          Noty.success('Welcome back `'+ info.user.user_full_name +'`');
          $location.path('/').replace();
        }, function(error) {
          Noty.error(error.error);
        });
    };

    Auth
      .user()
      .then(function(info) {
        Noty.info('Welcome back `'+ info.user.user_full_name +'`');
        $location.path('/').replace();
      });
  }
})(window.angular);
