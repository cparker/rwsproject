angular.module('rwsprojectApp')
    .controller('filesCtrl', ['$scope', 'FileUploader', 'dataService','$route',
        function ($scope, FileUploader, dataService,$route) {

            console.log('current params');
            console.log($route);

            $scope.baseUploadURL = '/server/uploadFile';

            $scope.fileData = {
                "files": [],
                "dirs": []
            };

            $scope.filesize = filesize;


            var refreshFiles = function (dir) {
                dataService.getFiles(dir)
                    .success(function (fs) {
                        $scope.fileData = fs.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };


            $scope.selectDir = function (dir) {
                console.log('dirUrl is ' + dir.url);
                refreshFiles(dir);
            };

            $scope.uploader = new FileUploader();
            $scope.uploader.url = $scope.baseUploadURL;
            $scope.uploader.removeAfterUpload = true;

            $scope.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            $scope.uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            $scope.uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            $scope.uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            $scope.uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };
            $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            $scope.uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            $scope.uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
                refreshFiles($route.current.params.dir);
            };


            if ($route.current.params.dir) {
                $scope.selectedDir = $route.current.params.dir;
                $scope.uploader.url = $scope.baseUploadURL + '?dir=' + $route.current.params.dir;
                refreshFiles($route.current.params.dir);
            }

        }
    ]);
