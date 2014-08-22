'use strict';

/**
 * @ngdoc function
 * @name rwsprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rwsprojectApp
 */
angular.module('rwsprojectApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // this should use $http and ask the server if the user is logged in
        // what happens when their session times out?
        $scope.loggedIn = true;

    });
