;(function(angular) {
  'use strict';

  angular
    .module('condor.image')
    .directive('condorImageList', ['$http', '$timeout', function($http, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          src: '=',
          x: '@',
          y: '@',
          type: '@',
          uploadUrl: '@'
        },
        template:
          '<div class="row" ng-if="isArray">'+
            '<div class="col-lg-4 col-md-6" ng-repeat="image in src track by $index">'+
              '<div>'+
                '<div class="col-lg-12">'+
                  '<condor-image src="src[$index]" x="{{ x }}" y="{{ y }}" type="{{ type }}" upload-url="{{ uploadUrl }}" />'+
                '</div>'+
              '</div>'+
              '<div>'+
                '<div class="col-lg-12 text-center">'+
                  '<button type="button" ng-dblclick="removeImageAt($index)" class="btn btn-danger" style="margin-top: 8px;"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;double click to delete</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>',
        controller: function($scope, $element, $attrs) {
          $scope.type = $scope.type || 'image/jpeg';
          $scope.uploadUrl = $scope.uploadUrl || 'http://rock.io/S3';
          var unregisterListener = $scope.$watch('src', function(newVal, oldVal) {
            $scope.isArray = angular.isArray(newVal) ? true : false;
          });

          $scope.removeImageAt = function(index) {
            $http.delete($scope.src[index].deleteUrl);
            $timeout(function() {
              $scope.src.splice(index, 1);
            });
          };

          $scope.$on('$destroy', function() {
            unregisterListener();
          });
        }
      };
    }]);
})(window.angular);
