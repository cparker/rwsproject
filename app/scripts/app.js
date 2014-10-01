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
        'ngTouch',
        'ngMockE2E'
    ]);

theApp
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

theApp
    .run(function ($httpBackend, dataService) {
        console.log('theApp is initializing');

        var mockEnabled = false;

        if (mockEnabled == true) {
            console.log('MOCK DATA in effect');

            dataService.fixtureLines = mockFixtureLines;
            dataService.fixtureLineSelectChoices = mockFixtureLineSelectChoices;

            $httpBackend.whenGET('/server/checkAccess')
                .respond(200, {});

            $httpBackend.whenGET('/server/getProjectInfo')
                .respond(mockProjectInfo);

            $httpBackend.whenGET(/.*\.html/).passThrough();

            $httpBackend.whenGET(/^\/server.*/).passThrough();

            $httpBackend.whenDELETE(/.*/).passThrough();
        } else {
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPOST(/.*/).passThrough();
            $httpBackend.whenPUT(/.*/).passThrough();
            $httpBackend.whenDELETE(/.*/).passThrough();
        }
    });
