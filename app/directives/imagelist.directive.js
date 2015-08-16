;(function(angular) {
  'use strict';

  angular.module('condor.imageList', ['condor.crop']);

  angular
    .module('condor.imageList')
    .directive('imageList', function() {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          src: '=',
          x: '@',
          y: '@'
        },
        template:
          '<div class="row" ng-show="isArray">'+
            '<div class="col-lg-4 col-md-6 text-center" ng-repeat="image in src track by $index">'+
              '<crop src="src[$index]" x="{{ x }}" y="{{ y }}" />'+
              '<button type="button" ng-dblclick="removeImageAt($index)" class="btn btn-danger" style="margin-top: 8px;"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
            '</div>'+
          '</div>',
        controller: function($scope, $element, $attrs) {
          var unregisterListener = $scope.$watch('src', function(newVal, oldVal) {
            $scope.isArray = angular.isArray(newVal) ? true : false;
          });

          $scope.removeImageAt = function(index) {
            $scope.src.splice(index, 1);
          };

          $scope.$on('$destroy', function() {
            unregisterListener();
          });
        }
      };
    });
})(window.angular);
