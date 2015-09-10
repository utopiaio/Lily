;(function(angular) {
  'use strict';

  // as the canvas `toBlob` API is only available on Mozila we're using a polyfill (from MDN)
  function _toBlob(canvas, callback, type, quality) {
    type = type || 'image/jpeg';
    quality = quality || 0.6;

    var _binaryString = atob(canvas.toDataURL(type, quality).split(',')[1]);
    var _length = _binaryString.length;
    var _array = new Uint8Array(_length);

    for(var i = 0; i < _length; i++) {
      _array[i] = _binaryString.charCodeAt(i);
    }

    callback(new Blob([_array], {type: type}));
  }

  angular
    .module('condor.image')
    .directive('condorImage', ['$http', '$timeout', function($http, $timeout) {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          src: '=',
          x: '@',
          y: '@',
          type: '@',
          quality: '=',
          uploadUrl: '@'
        },
        template:
          '<div class="row">'+
            '<div class="col-lg-12">'+
              '<div class="row">'+
                '<div class="col-lg-12 text-center">'+
                  '<img class="img-responsive" ng-src="{{ src.url }}" />'+
                '</div>'+
              '</div>'+
              '<div class="row" ng-if="uncropped && src.size > 0">'+
                '<div class="col-lg-12 text-center" style="margin-top: 8px;">'+
                  '<button ng-click="crop()" class="btn btn-primary"><i class="fa fa-crop"></i>&nbsp;&nbsp;crop image</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '<div>',
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
          scope.type = scope.type || 'image/jpeg';
          scope.quality = scope.quality || 0.6;
          scope.uploadUrl = scope.uploadUrl || 'http://rock.io/S3';

          $timeout(function() {
            if(angular.isObject(scope.src) === true) {
              scope.uncropped = false;
              $($('img', element)[0]).attr({src: scope.src.url});
            }
          });

          var unregisterListener = scope.$watch('src', function(newVal, oldVal) {
            if(selfMutated === false && angular.isObject(scope.src) === false) {
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
                  $timeout(function() {
                    selfMutated = true;
                    _toBlob($($('img', element)[0]).cropper('getCroppedCanvas'), function(blob) {
                      var formData = new FormData();
                      formData.append('files[]', blob);

                      $http({
                        method: 'POST',
                        url: scope.uploadUrl,
                        headers: {
                          'Content-Type': undefined
                        },
                        data: formData
                      }).success(function(data, status, headers) {
                        // assigning here doesn't affect the crop view's source
                        // since it's *outside* the digest cycle
                        scope.src = data.files[0];
                        _restSelfMutatedFlag();
                      }).error(function(data) {
                        alert('unable to save image');
                      });
                    }, scope.type, scope.quality);
                  });
                }
              });
            }
          });

          scope.crop = function() {
            $http.delete(scope.src.deleteUrl);

            _toBlob($($('img', element)[0]).cropper('getCroppedCanvas'), function(blob) {
              var formData = new FormData();
              formData.append('files[]', blob);

              $http({
                method: 'POST',
                url: scope.uploadUrl,
                headers: {
                  'Content-Type': undefined
                },
                data: formData
              }).success(function(data, status, headers) {
                selfMutated = true;
                scope.src = data.files[0];
                $($('img', element)[0]).cropper('destroy');
                $($('img', element)[0]).attr({src: scope.src.url});
                _restSelfMutatedFlag();
              }).error(function(data) {
                alert('unable to save image');
              });
            }, scope.type, scope.quality);

            scope.uncropped = false;
          };

          scope.$on('$destroy', function() {
            unregisterListener();
            $($('img', element)[0]).cropper('destroy');
          });
        }
      };
    }]);
})(window.angular);
