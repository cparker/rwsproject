'use strict';

/**
 * @ngdoc function
 * @name rwsprojectApp.controller:MainCtrl
 * @description
 * # HomeCtrl
 * Controller of the rwsprojectApp
 */
angular.module('rwsprojectApp')
    .controller('HomeCtrl', function ($scope) {

        $scope.rock = 'and roll';

        // this should use $http and ask the server if the user is logged in
        // what happens when their session times out?
        $scope.isLoggedIn = false;


    });
