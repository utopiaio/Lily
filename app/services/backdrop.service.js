;(function(angular) {
  'use strict';

  var _timeout = 5000;
  var _spinner = null;
  var _timeoutPromise = null;
  var _options = {
    lines: 32,
    length: 8,
    width: 4,
    radius: 32,
    scale: 1,
    corners: 1,
    color: '#fff',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 75,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: false,
    hwaccel: true,
    position: 'absolute'
  };

  angular.module('condor.backdrop', []);

  angular
    .module('condor.backdrop')
    .config(Config)
    .provider('Backdrop', function() {
      return {
        config: function(timeout, options) {
          if(!angular.isUndefined(timeout)) {
            _timeout = timeout;
          }

          if(!angular.isUndefined(options)) {
            _options = angular.extend(_options, options);
          }
        },

        $get: [function() {
          return {};
        }]
      };
    });

  Config.$inject = ['$httpProvider'];

  function Config($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$timeout', function($q, $timeout) {
      var _removeBackdrop = function() {
        if(_timeoutPromise !== null && _spinner !== null) {
          _spinner.stop();
          _spinner = null;
          $('.modal-backdrop').remove();
          $timeout.cancel(_timeoutPromise);
          _timeoutPromise = null;
        }
      };

      return {
       'request': function(config) {
          $('<div class="modal-backdrop"></div>').appendTo(document.body);
          _spinner = new Spinner(_options).spin(document.querySelector('body'));

          _timeoutPromise = $timeout(function() {
            if(_spinner !== null) {
              _spinner.stop();
              _spinner = null;
              $('.modal-backdrop').remove();
            };
          }, _timeout);

          return config;
        },

        'response': function(response) {
          _removeBackdrop();
          return response;
        },

        'responseError': function(rejection) {
          _removeBackdrop();
          return $q.reject(rejection);
        }
      };
    }]);
  }
})(window.angular);
