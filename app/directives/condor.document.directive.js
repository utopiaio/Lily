;(function(angular) {
  'use strict';

  angular
    .module('condor.document')
    .directive('condorDocument', [function() {
      return {
        restrict: 'EA',
        scope: {
          src: '='
        },
        template:
          '<div class="row" ng-if="src.hasOwnProperty(\'name\')">'+
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">'+
              '<i class="fa fa-file-text-o" style="font-size: 72px;"></i>'+
              '<p ng-bind="src.name" style="margin-top: 8px;"></p>'+
            '</div>'+
          '</div>'
      };
    }]);
})(window.angular);
