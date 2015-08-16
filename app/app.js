;(function(angular) {
  'use strict';

  angular.module('condor', ['ngRoute',
                            'ngSanitize',
                            'ngMessages',
                            'summernote',
                            'condor.calendar',
                            'condor.document',
                            'condor.image',
                            'condor.auth',
                            'condor.noty',
                            'condor.backdrop']);
})(window.angular);
