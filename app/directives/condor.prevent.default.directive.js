;(function(angular) {
  'use strict';

  angular.module('condor.prevent.default', []);

  angular
    .module('condor.prevent.default')
    .directive('preventDefault', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attribute) {
          $(element).click(function(e) {
            e.preventDefault();
          });

          scope.$on('$destroy', function() {
            $(element).unbind();
          });
        }
      };
    });
})(window.angular);
