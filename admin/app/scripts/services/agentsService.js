'use strict';

angular.module('sbAdminApp').service('AgentsService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var AGENTS = 'agents';
  
  function getAll() {
    var deferred = $q.defer();
      RestService.get(AGENTS).then(function (result) {
        deferred.resolve(ObjectBuilder.buildObject('agents', result.data));
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  function getById() {
    var deferred = $q.defer();
      RestService.get(AGENTS + '/' + id).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('agent', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
  }

  function add(name) {
    var deferred = $q.defer();
      RestService.post(AGENTS, {name: name}).then(function (result) {
        return deferred.resolve(result);
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
  }

  function update(id, name) {
    var deferred = $q.defer();
    RestService.post(AGENTS + '/' + id, {name: name}).then(function (result) {
      return deferred.resolve(result);
    }, function (error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  }

  function remove(id) {
    var deferred = $q.defer();
    RestService.delete(AGENTS + '/' + id).then(function (result) {
      return deferred.resolve(result);
    }, function (error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  }

  function removeByIds(ids) {
    var deferred = $q.defer();
    var promises = ids.map(function (each) {
        return remove(id);
    });

    $q.all(promises).then(function() {
        deferred.resolve(result);
    }, function(error) {
        deferred.reject(error);
    });

    return deferred.promise;


  }
  
  return { getAll: getAll, getById: getById, add: add, update: update, remove: remove, removeByIds: removeByIds };
}]);