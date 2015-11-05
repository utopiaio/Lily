;(function(angular) {
  'use strict';

  angular.module('condor.api', ['condor.auth']);

  angular
    .module('condor.api')
    .provider('API', function() {
      var _options = {
        baseUrl: 'http://rock.io/', // base URL to our API
        headerName: 'X-Access-Token', // header name for JWT
        id: {} // a map of model-id key so mutations are handled properly
      };
      var _JWT = {};
      var _headers = {headers: {}};
      var _store = {};

      return {
        config: function(options) {
          _options = angular.extend(_options, options);
        },

        $get: ['$rootScope', '$q', '$http', '$timeout', 'Auth', function($rootScope, $q, $http, $timeout, Auth) {
          var _emitChange = function(p) {
            $timeout(function() {
              p === undefined ? $rootScope.$emit('CHANGE') : $rootScope.$emit('CHANGE', p);
            });
          };

          Auth.subscribe($rootScope, function(e, info) {
            if(info !== null) {
              _JWT = info.jwt;
              _headers.headers[_options.headerName] = _JWT;
            }
          });

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

            /**
             * @param {string} model
             * @param {integer} id
             * @return {object} requested data model
             */
            get: function(model, id) {
              var deferred = $q.defer();

              // running Auth on every REST request makes sure
              // we don't run into those nasty race conditions
              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;

                  if(_store.hasOwnProperty(model)) {
                    var found = false;

                    angular.forEach(_store[model], function(value, key) {
                      if(value[_options.id[model]] === id) {
                        found = true;
                        deferred.resolve(value);
                      }
                    });

                    if(!found) {
                      $http
                        .get(_options.baseUrl + model + '/' + id, _headers)
                        .success(function(data) {
                          _store[model].push(data);
                          deferred.resolve(data);
                          _emitChange(_store);
                        })
                        .error(function(data) {
                          deferred.reject(data);
                        });
                    }
                  } else {
                    $http
                      .get(_options.baseUrl + model + '/' + id, _headers)
                      .success(function(data) {
                        deferred.resolve(data);
                        _emitChange(_store);
                      })
                      .error(function(data) {
                        deferred.reject(data);
                      });
                  }
                });

              return deferred.promise;
            },

            /**
             * @param {string} model
             * @return {array} - query result
             */
            query: function(model) {
              var deferred = $q.defer();

              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;

                  if(_store.hasOwnProperty(model)) {
                    deferred.resolve(_store[model]);
                  } else {
                    $http
                      .get(_options.baseUrl + model, _headers)
                      .success(function(data) {
                        _store[model] = data;
                        deferred.resolve(data);
                        _emitChange(_store);
                      })
                      .error(function(data) {
                        deferred.reject(data);
                      });
                  }
                });

              return deferred.promise;
            },

            /**
             * @param {string} model
             * @param {string} q
             * @param {integer} limit
             * @return {array} - search query result
             */
            search: function(model, query, limit) {
              var deferred = $q.defer();

              if(limit === undefined) {
                limit = 100;
              }

              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;
                  _headers.params = {q: query, limit: limit};

                  $http
                    .get(_options.baseUrl + model, _headers)
                    .success(function(data) {
                      delete _headers.params;
                      deferred.resolve(data);
                    })
                    .error(function(data) {
                      deferred.reject(data);
                    });
                })
                .catch(function(error) {
                  deferred.reject(error);
                });

              return deferred.promise;
            },

            /**
             * @param {string} model
             * @param {object} data
             * @return {object} - newly saved model object
             */
            save: function(model, data) {
              var deferred = $q.defer();

              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;

                  $http
                    .post(_options.baseUrl + model, data, _headers)
                    .success(function(data) {
                      deferred.resolve(data);

                      if(_store.hasOwnProperty(model)) {
                        _store[model].push(data);
                      }

                      _emitChange(_store);
                    })
                    .error(function(data) {
                      deferred.reject(data);
                    });
                });

              return deferred.promise;
            },

            /**
             * @param {string} model
             * @param {object} data
             * @return {object} - updated data object
             */
            update: function(model, data) {
              var deferred = $q.defer();

              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;

                  $http
                    .put(_options.baseUrl + model + '/' + data[_options.id[model]], data, _headers)
                    .success(function(data) {
                      deferred.resolve(data);

                      if(_store.hasOwnProperty(model)) {
                        angular.forEach(_store[model], function(value, index) {
                          if(value[_options.id[model]] === data[_options.id[model]]) {
                            _store[model][index] = data;
                            _emitChange(_store);
                          }
                        });
                      }
                    })
                    .error(function(data) {
                      deferred.reject(data);
                    });
                });

              return deferred.promise;
            },

            /**
             * @param {string} model
             * @param {object} data
             * @return {object} - deleted model object
             */
            delete: function(model, data) {
              var deferred = $q.defer();

              Auth
                .user()
                .then(function(info) {
                  _JWT = info.jwt;
                  _headers.headers[_options.headerName] = _JWT;

                  $http
                    .delete(_options.baseUrl + model + '/' + data[_options.id[model]], _headers)
                    .success(function(data) {
                      deferred.resolve(data);

                      if(_store.hasOwnProperty(model)) {
                        angular.forEach(_store[model], function(value, index) {
                          if(value[_options.id[model]] === data[_options.id[model]]) {
                            _store[model].splice(index, 1);
                            _emitChange(_store);
                          }
                        });
                      }
                    })
                    .error(function(data) {
                      deferred.reject(data);
                    });
                });

              return deferred.promise;
            }
          };
        }]
      };
    });
})(window.angular);
