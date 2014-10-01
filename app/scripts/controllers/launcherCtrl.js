'use strict';

/**
 * @ngdoc function
 * @description
 *
 */
angular.module('rwsprojectApp')
    .controller('launcherCtrl', ['$scope', 'FileUploader', 'dataService', '$route', '$rootScope', '$httpBackend',
        function ($scope, FileUploader, dataService, $route, $rootScope, $httpBackend) {

            $scope.user = {};

            dataService.checkAccess()
                .success(function () {
                    $rootScope.isLoggedIn = true;
                    $scope.$emit('loggedInChanged', true);
                })
                .error(function () {
                    $rootScope.isLoggedIn = false;
                    $scope.$emit('loggedInChanged', false);
                });

            $scope.doLogin = function () {
                dataService.doLogin($scope.user.name, $scope.user.password)
                    .success(function (data, status) {
                        $rootScope.isLoggedIn = true;
                        $scope.invalidCredentials = false;
                        $scope.$emit('loggedInChanged', true);
                    }).error(function (data, status) {
                        $scope.invalidCredentials = true;
                        $scope.$emit('loggedInChanged', false);
                        // $rootScope.isLoggedIn = true;
                        console.log(data);
                    });

            };

        }]);

