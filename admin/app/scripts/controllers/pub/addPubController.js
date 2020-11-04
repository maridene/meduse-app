'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddPubCtrl
 * @description
 * # MainCtrl
 * Controller of the add blog publication page
 */

angular.module('sbAdminApp').controller('AddPubCtrl', ['$scope', '$q', 'BlogService', 'Upload', function ($scope, $q, BlogService, Upload) {
  $scope.mediaType = 'video';

  $scope.addPub = function () {
    var date = new Date().toISOString().split('T')[0];
    var blog = {
      title: $scope.title,
      description: $scope.description,
      date: date,
      videolink: null,
      imagefilename: null
    };
    var preAddPromise = $scope.mediaType === 'video' ? $q.when() : upload($scope.file);
    preAddPromise.then(function (filename) {
      if (filename) {
        blog.imagefilename = filename;
      } else {
        blog.videolink = $scope.videolink;
      }

      BlogService.add(blog).then(function () {
        clear();
        showModal("#successModal");
      }, function () {
        showModal("#errorModal");
      });
    }, function () {
      return showModal("#errorModal");
    });
  };

  var clear = function clear() {
    $scope.title = '';
    $scope.description = '';
    $scope.mediaType = 'video';
    $scope.videolink = '';
  };

  var upload = function upload(file) {
    var deferred = $q.defer();
    Upload.upload({
      url: SERVER_URL + '/blogupload',
      //webAPI exposed to upload the file
      data: {
        file: file
      } //pass file as data, should be user ng-model

    }).then(function (resp) {
      //upload function returns a promise
      if (resp.data.error_code === 0) {
        //validate success
        //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
        deferred.resolve(resp.data.filename);
      } else {
        deferred.reject();
      }
    }, function (error) {
      //catch error
      deferred.reject(error);
    }, function (evt) {
      console.log(evt);
      /*var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress*/
    });
    return deferred.promise;
  };

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);

    if (dlgElem) {
      dlgElem.modal("show");
    }
  };
}]);