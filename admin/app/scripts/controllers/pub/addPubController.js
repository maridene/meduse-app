'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddPubCtrl
 * @description
 * # MainCtrl
 * Controller of the add blog publication page
 */
angular.module('sbAdminApp')
  .controller('AddPubCtrl', ['$scope', '$q', 'BlogService', 'Upload', function ($scope, $q, BlogService, Upload) {
    $scope.mediaType = 'video';
    $scope.addPub = () => {
      const date = new Date().toISOString().split('T')[0];
      const blog = {
        title: $scope.title, 
        description: $scope.description,
        date: date, 
        videolink: null, 
        imagefilename : null
      };

      const preAddPromise = $scope.mediaType === 'video' ? $q.when() : upload($scope.file);

      preAddPromise
      .then((filename) => {
        if (filename) {
          blog.imagefilename = filename;
        } else {
          blog.videolink = $scope.videolink;
        }
        BlogService.add(blog)
        .then(() => {
          clear();
          showModal("#successModal");
        }, () => {
          showModal("#errorModal");
        });
      }, () => showModal("#errorModal"));
    };

    const clear = () => {
      $scope.title = '';
      $scope.description = '';
      $scope.mediaType = 'video';
      $scope.videolink  = '';
    };

    const upload = (file) => {
      const deferred = $q.defer();
      Upload
        .upload({
          url: 'http://localhost:3000/blogupload', //webAPI exposed to upload the file
          data:{file:file} //pass file as data, should be user ng-model
        })
        .then((resp) => { //upload function returns a promise
          if(resp.data.error_code === 0){ //validate success
              //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
              deferred.resolve(resp.data.filename);
          } else {
              deferred.reject();
          }
        },
        (error) => { //catch error
          deferred.reject(error);
        },
        (evt) => {
          console.log(evt);
          /*var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress*/
        }
      );
          
      return deferred.promise;
    };

    const showModal = (id) => {
      const dlgElem = angular.element(id);
      if (dlgElem) {
          dlgElem.modal("show");
      }
    };
    
}]);