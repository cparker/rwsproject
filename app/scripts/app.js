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
                templateUrl: 'views/launcher.html',
                controller: 'launcherCtrl'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                reloadOnSearch: false
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/files', {
                templateUrl: 'views/files.html',
                controller: 'filesCtrl',
                reloadOnSearch: false
            })
            .when('/dirs', {
                templateUrl: 'views/dirs.html',
                controller: 'filesCtrl',
                reloadOnSearch: false
            })
            .when('/#tab:*/', {
                reloadOnSearch: false
            })
            .when('/printSummary', {
                templateUrl: 'views/printSummary.html',
                controller: 'printSummaryCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
