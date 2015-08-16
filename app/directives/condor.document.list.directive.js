;(function(angular) {
  'use strict';

  angular
    .module('condor.document')
    .directive('condorDocumentList', ['$http', function($http) {
      return {
        restrict: 'EA',
        scope: {
          src: '='
        },
        template:
          '<div class="row">'+
            '<div ng-if="isArray === true" class="col-lg-4 col-md-6 col-sm-12 col-xs-12 text-center" ng-repeat="document in src track by $index">'+
              '<div class="row">'+
                '<div class="col-lg-12">'+
                  '<condor-document src="document" />'+
                '</div>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col-lg-12">'+
                  '<button type="button" ng-dblclick="removeDocAt($index)" class="btn btn-danger"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>',
        controller: function($scope, $element, $attrs) {
          var unregisterListener = $scope.$watch('src', function(newVal, oldVal) {
            $scope.isArray = angular.isArray(newVal) ? true : false;
          });

          $scope.removeDocAt = function(index) {
            // optimistic update
            $http.delete($scope.src[index].deleteUrl);
            $scope.src.splice(index, 1);
          };

          $scope.$on('$destroy', function() {
            unregisterListener();
          });
        }
      };
    }]);
})(window.angular);
