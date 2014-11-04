'use strict';

/**
 * @ngdoc function
 * @name rwsprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rwsprojectApp
 */
angular.module('rwsprojectApp')
    .controller('MainCtrl', ['$scope', '$http', '$rootScope', 'dataService', '$window',
        function ($scope, $http, $rootScope, dataService, $window) {

            $rootScope.parseInt = parseInt;

            $rootScope.print = function () {
                $window.print();
            };

            $rootScope.back = function () {
                $window.history.back();
            };

            console.log('main controller is being instantiated, id ' + $scope.id);

            $scope.user = {};
            $rootScope.authenticatedUser = {};
            $rootScope.isLoggedIn = undefined;

            $rootScope.dataService = dataService;

            dataService.checkAccess()
                .success(function (data) {
                    $rootScope.isLoggedIn = true;
                    $rootScope.authenticatedUser.username = data.username;
                    $rootScope.authenticatedUser.role = data.role;
                    $scope.$emit('loggedInChanged', true);
                })
                .error(function () {
                    $rootScope.authenticatedUser = {};
                    $rootScope.isLoggedIn = false;
                    $scope.$emit('loggedInChanged', false);
                });

            $scope.doLogin = function () {
                dataService.doLogin($scope.user.name, $scope.user.password)
                    .success(function (data, status) {
                        $rootScope.isLoggedIn = true;
                        $rootScope.authenticatedUser.username = data.username;
                        $rootScope.authenticatedUser.role = data.role;
                        $scope.invalidCredentials = false;
                        $scope.$emit('loggedInChanged', true);
                    }).error(function (data, status) {
                        $scope.invalidCredentials = true;
                        $rootScope.authenticatedUser = {};
                        $scope.$emit('loggedInChanged', false);
                    });

            };

            $scope.signoff = function () {
                console.log('signing off');
                dataService.signoff();
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
