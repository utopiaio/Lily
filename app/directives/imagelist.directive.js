;(function(angular) {
  'use strict';

  angular.module('condor.imageList', []);

  angular
    .module('condor.imageList')
    .directive('imageList', function() {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          src: '='
        },
        template: '<div class="row">'+
          '<span ng-if="multiple === true">'+
            '<div class="col-lg-3 col-md-4 col-sm-12 col-xs-12" ng-repeat="image in src track by $index">'+
              '<div class="thumbnail" style="border: none;">'+
                '<img class="img-responsive" ng-src="{{ image }}" />'+
                '<div class="caption text-center">'+
                  '<button type="button" ng-dblclick="removeImageAt($index)" class="btn btn-danger"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</span>'+
          '<span ng-if="multiple === false && src.length > 0">'+
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
              '<div class="thumbnail" style="border: none;">'+
                '<img class="img-responsive" ng-src="{{ src }}" />'+
                '<div class="caption text-center">'+
                  '<button type="button" ng-dblclick="clearImage()" class="btn btn-danger"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</span>'+
        '</div>',
        controller: function($scope, $element, $attrs) {
          var unregisterListener = $scope.$watch('src', function(newVal, oldVal) {
            $scope.multiple = angular.isString(newVal) ? false : true;
          });

          $scope.removeImageAt = function(index) {
            $scope.src.splice(index, 1);
          };

          $scope.clearImage = function() {
            $scope.src = '';
          };

          $scope.$on('$destroy', function() {
            unregisterListener();
          });
        }
      };
    });
})(window.angular);
