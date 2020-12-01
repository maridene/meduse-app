'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddPubCtrl
 * @description
 * # MainCtrl
 * Controller of the edit blog publication page
 */

angular.module('sbAdminApp').controller('EditPubCtrl', ['$scope', '$q', '$stateParams', 'BlogService', 'Upload', function ($scope, $q, $stateParams, BlogService, Upload) {
    $scope.pub = {};
    $scope.form = {};
    BlogService.getById($stateParams.id).then(
        function(pub) {
            $scope.pub = pub;
            $scope.form = {
                title: $scope.pub.title,
                description: $scope.pub.description,
                videolink: $scope.pub.videolink,
                imagefilename: $scope.pub.imagefilename,
                coverfilename: $scope.pub.coverfilename,
                tags: $scope.pub.tags
            };
            if ($scope.pub.videolink && $scope.pub.videolink.length) {
                $scope.mediaType = 'video';
            } else {
                $scope.mediaType = 'image';
            }
            
            $scope.imagePreview = SERVER_URL + '/static/blogs/' + $scope.pub.imagefilename;
            $scope.coverPreview = SERVER_URL + '/static/blogs/' + $scope.pub.coverfilename;
            
        }, function (err) {
            showModal('errorRetrieveModal');
        }
    );

    $scope.addTag = function () {
        if (!isBlank($scope.tagItem) && $scope.form.tags.indexOf($scope.tagItem) === -1) {
          $scope.form.tags.push($scope.tagItem);
          $scope.tagItem = '';
        }
    };
    $scope.removeTag = function (tagToRemove) {
        $scope.form.tags = $scope.form.tags.filter(function(item) {
            return item !== tagToRemove;
        });
    };

    $scope.coverFileChange = function () {
        $scope.coverPreview = null;
    };
    $scope.imageFileChange = function () {
        $scope.imagePreview = null;
    };

    $scope.submit = function () {
        var blog = {
          title: $scope.form.title,
          description: $scope.form.description,
          videolink: $scope.mediaType === 'video' ? $scope.form.videolink : null,
          imagefilename: $scope.mediaType === 'image' ? $scope.form.imagefilename : null,
          coverfilename: $scope.form.coverfilename,
          tags: $scope.form.tags.toString(),
        };
        var uploadCoverPromise = $scope.coverFile ? upload($scope.coverFile) : $q.when();
        var uploadImagePromise = $scope.mediaType === 'image' && $scope.file ? upload($scope.file) : $q.when();
        uploadCoverPromise.then(function (coverFilename) {
          if(coverFilename) {
            blog.coverfilename = coverFilename;
          }
          uploadImagePromise.then(function (filename) {
            if (filename) {
              blog.imagefilename = filename;
            } else {
              blog.videolink = $scope.form.videolink;
            }
      
            BlogService.update($scope.pub.id, blog).then(function () {
              showModal("#successModal");
            }, function () {
              showModal("#errorModal");
            });
          }, function () {
            return showModal("#errorModal");
          });
        }, function(error) {
          return showModal("#errorModal");
        });
        
      };
    
      var upload = function upload(file) {
        var deferred = $q.defer();
        Upload.upload({
          url: SERVER_URL + '/blogupload/',
          data: {
            file: file
          }
        }).then(function (resp) {
          //upload function returns a promise
          if (resp.data.error_code === 0) {
            deferred.resolve(resp.data.filename);
          } else {
            deferred.reject();
          }
        }, function (error) {
          //catch error
          deferred.reject(error);
        }, function (evt) {
          console.log(evt);
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
