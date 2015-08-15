;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .controller('TestController', TestController);

  TestController.$inject = [];

  function TestController() {
    var vm = this;

    vm.date = '';
    vm.images = '';
    vm.files = '';
  }
})(window.angular);
