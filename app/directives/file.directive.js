;(function(angular) {
  'use strict';

  angular.module('condor.document', []);

  angular
    .module('condor.document')
    .directive('document', ['$http', function($http) {
      return {
        restrict: 'EA',
        replace: true,
        require: 'ngModel',
        scope: {
          'uploadUrl': '@'
        },
        template: '<input type="file" style="opacity: 0; position: fixed; top: -1000; left: -1000;" />',
        link: function(scope, element, attribute, ngModel) {
          var unregisterListener = scope.$watch(function() {
            if (ngModel.$viewValue !== undefined) {
              var id = String(Math.random()).substr(2);
              var multiple = attribute.hasOwnProperty('multiple');
              var DOMButtonText = 'Click here to upload ';
                  DOMButtonText += multiple ?  'files' : 'a file';
              var DOM = '<button type="button" id="'+ id +'-button" class="btn btn-lg btn-primary btn-block"><i class="fa fa-file-o"></i>&nbsp;'+ DOMButtonText +'</button>';

              $(element).after(DOM);

              $('#'+ id +'-button').click(function(e) {
                $(element, 'input[type="file"]').trigger('click');
              });

              $(element, 'input[type="file"]').change(function(e) {
                var formData = new FormData();

                $.each(e.target.files, function(index, file) {
                  formData.append('files[]', file);
                });

                $http({
                  method: 'POST',
                  url: scope.uploadUrl,
                  headers: {
                    'Content-Type': undefined
                  },
                  data: formData
                }).success(function(data, status, headers) {
                  var fileList = ngModel.$viewValue;

                  if(multiple && angular.isArray(ngModel.$viewValue)) {
                    fileList = ngModel.$viewValue;
                  }

                  else if(multiple && !angular.isArray(ngModel.$viewValue)) {
                    fileList = [];
                  }

                  if(multiple) {
                    $.each(data.files, function(index, file) {
                      fileList.push(file);
                    });
                  }

                  multiple ? ngModel.$setViewValue(fileList) : ngModel.$setViewValue(data.files[0]);

                  // setting value to empty makes sure `change` event is triggered
                  $(element, 'input[type="file"]').val('');
                }).error(function(data, status, headers) {
                  alert('unable to upload files\nError: '+ status);
                  $(element, 'input[type="file"]').val('');
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
    }]);
})(window.angular);
