'use strict';

/**
 * @ngdoc function
 * @name rwsprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rwsprojectApp
 */
angular.module('rwsprojectApp')
    .controller('MainCtrl', ['$scope', '$http', '$rootScope', 'dataService', function ($scope, $http, $rootScope, dataService) {
        console.log('main controller is being instantiated');

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

        $rootScope.errorMessage = undefined;

        $rootScope.$on('error', function (event, errorMessage) {
            console.log('RS received event ' + event + ' error ' + errorMessage);

            $rootScope.errorMessage = errorMessage;
        });

        $rootScope.logit = function (stuff) {
            console.log(stuff);
        };

        $rootScope.dismissError = function () {
            $rootScope.errorMessage = undefined;
        }
    }]);
