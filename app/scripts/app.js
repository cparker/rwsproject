'use strict';

/**
 * @ngdoc overview
 * @name rwsprojectApp
 * @description
 * # rwsprojectApp
 *
 * Main module of the application.
 */
angular
    .module('rwsprojectApp', [
        'angularFileUpload',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                reloadOnSearch:false
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/files', {
                templateUrl: 'views/files.html',
                controller: 'filesCtrl'
            })
            .when('/#tab:*/', {
                reloadOnSearch:false
            })
            .otherwise({
                redirectTo: '/'
            });
    });
