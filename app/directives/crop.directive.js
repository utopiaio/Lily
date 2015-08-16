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
          '<div class="col-lg-12">'+
            '<div class="row">'+
              '<div class="col-lg-12 text-center">'+
                  '<img class="img-responsive" ng-src="{{ src }}" />'+
              '</div>'+
            '</div>'+
            '<div class="row" ng-if="uncropped && src.length > 0">'+
              '<div class="col-lg-12 text-center" style="margin-top: 8px;">'+
                '<button ng-click="crop()" class="btn btn-primary"><i class="fa fa-crop"></i>&nbsp;&nbsp;crop image</button>'+
              '</div>'+
            '</div>'+
          '</div>',
        link: function(scope, element, attribute) {
          /**
           * since we're mutating the data we're watching, after we self-mutate
           * we'll not be listing for any changes for the next 500ms
           */
          var _restSelfMutatedFlag = function() {
            var _selfie = setTimeout(function() {
              selfMutated = false;
              clearTimeout(_selfie);
            }, 500);
          };
          var selfMutated = false;
          scope.uncropped = true;
          scope.x = isNaN(Number(scope.x)) || scope.x === '' ? 16 : Number(scope.x);
          scope.y = isNaN(Number(scope.y)) || scope.y === '' ? 9 : Number(scope.y);

          var unregisterListener = scope.$watch('src', function(newVal, oldVal) {
            if(selfMutated === false) {
              scope.uncropped = true;
              $($('img', element)[0]).cropper('destroy');
              $($('img', element)[0]).attr({src: scope.src});
              $($('img', element)[0]).cropper({
                aspectRatio: scope.x / scope.y,
                guides: false,
                rotatable: false,
                wheelZoomRatio: 0.01,
                autoCropArea: 1,
                built: function() {
                  scope.$apply(function() {
                    selfMutated = true;
                    // assigning here doesn't affect the crop view's source
                    // since it's *outside* the digest cycle
                    scope.src = $($('img', element)[0]).cropper('getCroppedCanvas').toDataURL();
                    _restSelfMutatedFlag();
                  });
                }
              });
            }
          });

          scope.crop = function() {
            try {
              var newSrc = $($('img', element)[0]).cropper('getCroppedCanvas').toDataURL();
              selfMutated = true;
              scope.src = newSrc;
              $($('img', element)[0]).cropper('destroy');
              $($('img', element)[0]).attr({src: scope.src});
              _restSelfMutatedFlag();
            } catch(e) {
              console.warn('an invalid src was given, please make sure the image src is properly encoded i.e. to `DataURL`');
            }

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
