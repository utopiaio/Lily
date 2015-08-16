;(function(angular) {
  'use strict';

  angular.module('condor.documentList', []);

  angular
    .module('condor.documentList')
    .directive('documentList', ['$http', function($http) {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          src: '='
        },
        template:
          '<div class="row">'+
            '<div ng-if="multiple === true" class="col-lg-4 col-md-6 col-sm-12 col-xs-12 text-center" ng-repeat="document in src track by $index">'+
              '<div class="thumbnail" style="border: none;">'+
                '<i class="fa fa-file-text-o" style="font-size: 72px;"></i>'+
                '<p ng-bind="document.name" style="margin-top: 8px;"></p>'+
                '<div class="caption">'+
                  '<button type="button" ng-dblclick="removeDocAt($index)" class="btn btn-danger"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div ng-if="multiple === false && src.hasOwnProperty(\'name\')" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">'+
              '<div class="thumbnail" style="border: none;">'+
                '<i class="fa fa-file-text-o" style="font-size: 72px;"></i>'+
                '<p ng-bind="src.name" style="margin-top: 8px;"></p>'+
                '<div class="caption">'+
                  '<button type="button" ng-dblclick="clearDoc()" class="btn btn-danger"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>',
        controller: function($scope, $element, $attrs) {
          var unregisterListener = $scope.$watch('src', function(newVal, oldVal) {
            $scope.multiple = angular.isArray(newVal) ? true : false;
          });

          $scope.removeDocAt = function(index) {
            // optimistic update
            $http.delete($scope.src[index].deleteUrl);
            $scope.src.splice(index, 1);
          };

          $scope.clearDoc = function() {
            $scope.src = '';
          };

          $scope.$on('$destroy', function() {
            unregisterListener();
          });
        }
      };
    }]);
})(window.angular);
