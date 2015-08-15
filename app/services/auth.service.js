;(function(angular) {
  'use strict';

  angular.module('condor.auth', []);

  angular
    .module('condor.auth')
    .provider('Auth', function() {
      var _info = null;
      var _options = {
        url: 'http://rock.io/authenticate',
        key: 'rock',
        unauthorizedUrl: '/login'
      };

      return {
        authorized: ['$q', '$location', function($q, $location) {
          var deferred = $q.defer();

          localforage
            .getItem(_options.key)
            .then(function(value) {
              value === null ? deferred.reject({error: 'storage key `'+ _options.key +'` not found', code: -1}) : deferred.resolve(value);

              if(value === null) {
                $location.path(_options.unauthorizedUrl).replace();
              }
            });

          return deferred.promise;
        }],

        config: function(options) {
          _options = angular.extend(_options, options);
        },

        $get: ['$q', '$http', function($q, $http) {
          return {
            /*
             * authenticates a user
             */
            login: function(credentials) {
              var deferred = $q.defer();

              $http
                .post(_options.url, credentials)
                .success(function(data, status) {
                  localforage
                    .setItem(_options.key, data, function(error, value) {
                      error === null ? deferred.resolve(value) : deferred.reject(error);
                    });
                })
                .error(function(data, status) {
                  deferred.reject(data);
                });

              return deferred.promise;
            },

            /**
             * loges out a user --- clears entire storage
             */
            logout: function() {
              var deferred = $q.defer();

              localforage
                .clear(function(error) {
                  deferred.resolve();
                });

              return deferred.promise;
            },

            /**
             * returns current user info
             */
            user: function() {
              var deferred = $q.defer();

              localforage
                .getItem(_options.key)
                .then(function(value) {
                  value === null ? deferred.reject({error: 'storage key `'+ _options.key +'` not found', code: -1}) : deferred.resolve(value);
                });

              return deferred.promise;
            }
          };
        }]
      };
    });
})(window.angular);
