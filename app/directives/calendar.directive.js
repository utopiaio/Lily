;(function(angular) {
  'use strict';

  /**
   * ng-model will be assigned moment.utc().format() whenever possible
   * the value given to ng-model will be pg compatible value
   *
   * all JQuery option can be passed via data-*
   *
   * example:
   * <calendar ng-model="time"></calendar>
   * <calendar ng-model="time" data-mode="date"></calendar>
   * <calendar ng-model="time" data-mode="time"></calendar>
   * <calendar ng-model="time" data-mode="date-time" data-side-by-side="false"></calendar>
   */
  angular.module('condor.calendar', []);

  angular
    .module('condor.calendar')
    .directive('calendar', function() {
      return {
        restrict: 'EA',
        replace: true,
        require: 'ngModel',
        template: '<input type="text" class="form-control" />',
        link: function(scope, element, attribute, ngModel) {
          /**
           * given a moment object it'll update model according to the format
           * this MUST always receive valid moment object
           *
           * @param {Object} momentObject
           * @param {String} mode
           */
          var _updateModel = function(momentObject, mode) {
            switch(mode) {
              case 'time':
                ngModel.$setViewValue(momentObject.utc().format('HH:mm:ssZ'));
              break;

              case 'date':
                ngModel.$setViewValue(momentObject.format('YYYY-MM-DD'));
              break;

              default:
                ngModel.$setViewValue(momentObject.utc().format());
              break;
            }
          }

          var unregisterListener = scope.$watch(function() {
            if (ngModel.$viewValue !== undefined) {
              var data = $(element).data();
              var mode = data.mode || 'date-time';
              var defaultOption = {sideBySide: true};
              var momentClone = null;
              delete data.$ngModelController;
              delete data.mode;

              momentClone = mode === 'time' ? moment('1991-09-08T'+ ngModel.$modelValue) : moment(ngModel.$modelValue);
              if(!momentClone.isValid()) {
                momentClone = moment();
              }

              // this ONLY affects what gets to be displayed inside the input field
              switch(mode) {
                case 'time':
                  defaultOption.format = "hh:mm A";
                break;

                case 'date':
                  defaultOption.format = "MMMM D, YYYY";
                break;

                default:
                  defaultOption.format = "MMMM D, YYYY @ LT";
                break;
              }

              var option = angular.extend(defaultOption, data);
              $(element).val(momentClone.format(defaultOption.format));
              $(element).datetimepicker(option);
              _updateModel(momentClone, mode);

              $(element).on('dp.change', function(e) {
                scope.$apply(function() {
                  _updateModel(e.date, mode);
                });
              });

              scope.$on('$destroy', function(e) {
                $(element).data('DateTimePicker').destroy();
              });

              unregisterListener();
            }
          });
        }
      };
    });
})(window.angular);
