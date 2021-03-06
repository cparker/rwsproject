'use strict';

/**
 * @ngdoc overview
 * @name rwsprojectApp
 * @description
 * # rwsprojectApp
 *
 * Main module of the application.
 */
var theApp = angular
  .module('rwsprojectApp', [
    'angularFileUpload',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

theApp
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/launcher.html',
        controller: 'launcherCtrl',
        reloadOnSearch: false
      })
      .when('/home/:tab?', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        reloadOnSearch: false
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        reloadOnSearch: false
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
        controller: 'printSummaryCtrl',
        reloadOnSearch: false
      })
      .when('/printBOMSummary', {
        templateUrl: 'views/printBOMSummary.html',
        controller: 'printSummaryCtrl',
        reloadOnSearch: false
      })
      .when('/printFixture', {
        templateUrl: 'views/printFixture.html',
        controller: 'printSummaryCtrl',
        reloadOnSearch: false
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'uploadCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });


    $httpProvider.interceptors.push('myHttpInterceptor');
  });

theApp
  .run(function ($httpBackend, dataService) {
    console.log('theApp is initializing');
  });
