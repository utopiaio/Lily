;(function(angular) {
  'use strict';

  angular.module('condor.noty', []);

  angular
    .module('condor.noty')
    .factory('Noty', [function() {
      var _options = {
        theme: 'relax',
        layout: 'bottomLeft',
        timeout: 3000
      };

      return {
        alert: function(text) {
          noty(angular.extend({text: text, type: 'alert'}, _options));
        },

        success: function(text) {
          noty(angular.extend({text: '<i class="fa fa-check"></i>&nbsp;&nbsp;'+ text, type: 'success'}, _options));
        },

        error: function(text) {
          noty(angular.extend({text: '<i class="fa fa-ban"></i>&nbsp;&nbsp;'+ text, type: 'error'}, _options));
        },

        warring: function(text) {
          noty(angular.extend({text: '<i class="fa fa-exclamation-triangle"></i>&nbsp;&nbsp;'+ text, type: 'warning'}, _options));
        },

        info: function(text) {
          noty(angular.extend({text: '<i class="fa fa-info-circle"></i>&nbsp;&nbsp;'+ text, type: 'information'}, _options));
        },
      };
    }]);
})(window.angular);
