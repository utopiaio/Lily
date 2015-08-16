;(function(angular) {
  'use strict';

  angular.module('condor', ['ngRoute',
                            'ngSanitize',
                            'ngMessages',
                            'summernote',
                            'condor.calendar',
                            'condor.document',
                            'condor.image',
                            'condor.imageList',
                            'condor.auth',
                            'condor.noty',
                            'condor.backdrop',
                            'condor.crop']);
})(window.angular);
