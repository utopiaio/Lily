;(function(angular) {
  'use strict';

  angular
    .module('condor')
    .controller('TestController', TestController);

  TestController.$inject = [];

  function TestController() {
    var vm = this;

    // calendar
    // vm.d1 = '1991-09-08T00:00:00+00:00';
    // vm.d2 = '1991-09-08';
    // vm.d3 = '00:00:00+00';
    // vm.d1 = 'Invalid Date';
    // vm.d2 = 'Invalid Date';
    // vm.d3 = 'Invalid Date';
    vm.d1 = '';
    vm.d2 = '';
    vm.d3 = '';
    // vm.d1 = null;
    // vm.d2 = null;
    // vm.d3 = null;

    // document
    vm.doc1 = null;
    vm.doc2 = null;

    // image
    vm.image1 = [];
    vm.image2 = null;

    // wysiwyg
    vm.wysiwyg = '<b>wysiwyg</b>';
  }
})(window.angular);
