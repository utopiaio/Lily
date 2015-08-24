;(function(angular) {
  'use strict';

  angular.module('condor.readMore', []);

  angular
    .module('condor.readMore')
    .filter('limitHtml', ['$sce', function($sce) {
      return function(input, limit) {
        input = String(input);
        return $sce.trustAsHtml(input.length <= limit ? input : input.substr(0, limit).trim() + '...');
      };
    }]);
})(window.angular);
