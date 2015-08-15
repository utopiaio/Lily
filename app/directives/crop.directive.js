;(function(angular) {
  'use strict';

  angular.module('condor.crop', []);

  angular
    .module('condor.crop')
    .directive('crop', function() {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          src: '=',
          x: '@',
          y: '@'
        },
        template:
          '<div>'+
            '<div class="row">'+
              '<div class="col-lg-12 text-center">'+
                  '<img class="image-responsive" ng-src="{{ src }}" />'+
              '</div>'+
            '</div>'+
            '<div class="row" ng-if="uncropped">'+
              '<div class="col-lg-12 text-center" style="margin-top: 8px;">'+
                '<button ng-click="crop()" class="btn btn-primary">crop image</button>'+
              '</div>'+
            '</div>'+
          '</div>',
        link: function(scope, element, attribute) {
          var selfMutated = false;
          scope.uncropped = true;
          scope.x = isNaN(Number(scope.x)) || scope.x === '' ? 16 : Number(scope.x);
          scope.y = isNaN(Number(scope.y)) || scope.y === '' ? 9 : Number(scope.y);

          var unregisterListener = scope.$watch('src', function(newVal, oldVal) {
            if(selfMutated === true) {
              selfMutated = false;
            }

            else {
              scope.uncropped = true;
              $($('img', element)[0]).cropper('destroy');
              $($('img', element)[0]).cropper({
                aspectRatio: scope.x / scope.y,
                guides: false,
                rotatable: false,
                wheelZoomRatio: 0.01,
                autoCropArea: 1,
                built: function() {
                  scope.$apply(function() {
                    selfMutated = true;
                    scope.src = $($('img', element)[0]).cropper('getCroppedCanvas').toDataURL();
                  });
                }
              });
            }
          });

          scope.crop = function() {
            selfMutated = true;
            scope.src = $($('img', element)[0]).cropper('getCroppedCanvas').toDataURL();
            $($('img', element)[0]).cropper('destroy');
            scope.uncropped = false;
          };

          scope.$on('$destroy', function() {
            unregisterListener();
            $($('img', element)[0]).cropper('destroy');
          });
        }
      };
    });
})(window.angular);
