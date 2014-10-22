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
    .config(function ($routeProvider, $httpProvider) {
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


        $httpProvider.interceptors.push('myHttpInterceptor');
    });

theApp
    .run(function ($httpBackend, dataService) {
        console.log('theApp is initializing');

        if (rwsMockEnabled == true) {
            console.log('MOCK DATA in effect');

            dataService.fixtureLines = mockFixtureLines;

            $httpBackend.whenGET('/server/checkAccess')
                .respond(200, {});

            $httpBackend.whenGET('/server/getProjectInfo')
                .respond(mockProjectInfo);

            $httpBackend.whenGET('/server/regions')
                .respond(mockRegions);

            $httpBackend.whenGET('/server/getAccessories')
                .respond(mockAccessories);

            $httpBackend.whenGET('/server/getFixtureTypes')
                .respond(mockFixtureTypes);

            $httpBackend.whenGET(/.*\.html/).passThrough();

            $httpBackend.whenGET(/^\/server.*/).passThrough();

            $httpBackend.whenDELETE(/.*/).passThrough();

            $httpBackend.whenPOST('/server/submitProjectInfo').passThrough();
        } else {
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPOST(/.*/).passThrough();
            $httpBackend.whenPUT(/.*/).passThrough();
            $httpBackend.whenDELETE(/.*/).passThrough();
        }
    });
