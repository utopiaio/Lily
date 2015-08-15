;(function(angular) {
  'use strict';

  angular.module('condor.image', []);

  angular
    .module('condor.image')
    .directive('imageFile', function() {
      return {
        restrict: 'EA',
        replace: true,
        require: 'ngModel',
        template: '<input type="file" accept="image/*" style="opacity: 0; position: fixed; top: -1000; left: -1000;" />',
        link: function(scope, element, attribute, ngModel) {
          var unregisterListener = scope.$watch(function() {
            if (ngModel.$viewValue !== undefined) {
              var id = String(Math.random()).substr(2);
              var multiple = attribute.hasOwnProperty('multiple');
              var DOMButtonText = 'Click here to upload ';
                  DOMButtonText += multiple ?  'images' : 'an image';
              var DOM = '<button type="button" id="'+ id +'-button" class="btn btn-lg btn-primary btn-block"><i class="fa fa-picture-o"></i>&nbsp;'+ DOMButtonText +'</button>';

              $(element).after(DOM);

              $('#'+ id +'-button').click(function(e) {
                $(element, 'input[type="file"]').trigger('click');
              });

              $(element, 'input[type="file"]').change(function(e) {
                var fileList = ngModel.$viewValue;

                if(multiple && angular.isArray(ngModel.$viewValue)) {
                  fileList = ngModel.$viewValue;
                }

                else if(multiple && !angular.isArray(ngModel.$viewValue)) {
                  fileList = [];
                }

                $.each(e.target.files, function(index, file) {
                  var FR = new FileReader();

                  FR.onload = function(e) {
                    if(multiple) {
                      fileList.push(e.target.result);
                    }

                    else {
                      fileList = e.target.result;
                    }

                    scope.$apply(function() {
                      ngModel.$setViewValue(fileList);
                      $(element, 'input[type="file"]').val('');
                    });
                  };

                  FR.readAsDataURL(file);
                });
              });

              scope.$on('$destroy', function() {
                $('#'+ id +'-button').unbind();
                $(element, 'input[type="file"]').unbind();
              });

              unregisterListener();
            }
          });
        }
      };
    });
})(window.angular);
