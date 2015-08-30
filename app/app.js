;(function(angular) {
  'use strict';

  angular.module('condor', ['ngRoute',
                            'ngSanitize',
                            'ngMessages',
                            'summernote',
                            'condor.prevent.default',
                            'condor.calendar',
                            'condor.document',
                            'condor.filter',
                            'condor.image',
                            'condor.auth',
                            'condor.noty',
                            'condor.backdrop']);
})(window.angular);
