;(function(angular) {
  'use strict';

  /**
   * <div ng-bind-html="input | readMore:20 | sanitize"></div>
   */
  angular.module('condor.filter', []);

  angular
    .module('condor.filter')
    .filter('readMore', [function() {
      return function(input, limit) {
        if(angular.isUndefined(input) === true) {
          input = '';
        }

        input = String(input);
        return input.length <= limit ? input : input.substr(0, limit).trim() + '...';
      };
    }])
    .filter('sanitize', ['$sce', function($sce) {
      return function(input) {
        if(angular.isUndefined(input) === true) {
          input = '';
        }

        input = String(input);
        return $sce.trustAsHtml(input);
      };
    }]);
})(window.angular);
