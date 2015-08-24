;(function(angular) {
  'use strict';

  /**
   * <div ng-bind-html="input | readMore:20 | sanitize"></div>
   */
  angular.module('condor.readMore', []);

  angular
    .module('condor.readMore')
    .filter('readMore', [function() {
      return function(input, limit) {
        input = String(input);
        return input.length <= limit ? input : input.substr(0, limit).trim() + '...';
      };
    }])
    .filter('sanitize', ['$sce', function($sce) {
      return function(input) {
        input = String(input);
        return $sce.trustAsHtml(input);
      };
    }]);
})(window.angular);
