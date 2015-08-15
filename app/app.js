;(function(angular) {
  'use strict';

  angular.module('condor', ['ngRoute',
                            'ngSanitize',
                            'ngMessages',
                            'summernote',
                            'condor.calendar',
                            'condor.image',
                            'condor.document',
                            'condor.imageList',
                            'condor.documentList',
                            'condor.auth',
                            'condor.noty',
                            'condor.backdrop']);
})(window.angular);
