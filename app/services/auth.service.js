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
        authorized: ['$rootScope', '$q', '$location', function($rootScope, $q, $location) {
          var deferred = $q.defer();

          localforage
            .getItem(_options.key)
            .then(function(value) {
              if(value === null) {
                deferred.reject({error: 'storage key `'+ _options.key +'` not found', code: -1});
                $location.path(_options.unauthorizedUrl).replace();
              }

              else {
                _info = value;
                deferred.resolve(_info);
                $rootScope.$emit('CHANGE', _info);
              }
            });

          return deferred.promise;
        }],

        config: function(options) {
          _options = angular.extend(_options, options);
        },

        $get: ['$rootScope', '$q', '$http', '$timeout', function($rootScope, $q, $http, $timeout) {
          var _emitChange = function(p) {
            $timeout(function() {
              p === undefined ? $rootScope.$emit('CHANGE') : $rootScope.$emit('CHANGE', p);
            });
          };

          return {
            /**
             * subscribe to changes
             *
             * @param {object} $scope
             * @param {function} callback
             * @return {function} unregister function
             */
            subscribe: function(scope, callback) {
              var handler = $rootScope.$on('CHANGE', callback);
              scope.$on('$destroy', handler);

              return handler;
            },

            /*
             * authenticates a user
             *
             * @param {object} credentials
             */
            login: function(credentials) {
              var deferred = $q.defer();

              $http
                .post(_options.url, credentials)
                .success(function(data, status) {
                  localforage.setItem(_options.key, data, function(error, value) {
                    if(error === null) {
                      _info = data;
                      deferred.resolve(_info);
                      _emitChange(_info);
                    }

                    else {
                      deferred.reject(error);
                    }
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

              localforage.clear(function(error) {
                _info = null;
                deferred.resolve();
                _emitChange(_info);
              });

              return deferred.promise;
            },

            /**
             * updates user info
             *
             * @param {Object} newInfo
             */
            updateInfo: function(newInfo) {
              var deferred = $q.defer();

              // extending whatever changes were passed down
              newInfo = angular.extend(_info, newInfo);

              localforage.setItem(_options.key, newInfo, function(error, value) {
                if(error === null) {
                  _info = value;
                  deferred.resolve(_info);
                  _emitChange(_info);
                }

                else {
                  deferred.reject(error);
                }
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
                  _info = value;
                  value === null ? deferred.reject({error: 'storage key `'+ _options.key +'` not found', code: -1}) : deferred.resolve(_info);
                });

              return deferred.promise;
            }
          };
        }]
      };
    });
})(window.angular);
