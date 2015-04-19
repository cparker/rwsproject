angular.module('rwsprojectApp')
  .controller('uploadCtrl', ['$scope', 'FileUploader', 'dataService', '$route', '$rootScope',
    function ($scope, FileUploader, dataService, $route, $rootScope) {

      $scope.uploader = new FileUploader();
      $scope.baseUploadURL = '/server/uploadFixtureCSV';
      $scope.uploader.url = $scope.baseUploadURL;
      $scope.uploader.removeAfterUpload = true;

    }]);

