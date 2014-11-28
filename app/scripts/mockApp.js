'use strict';


angular.module('rwsprojectAppE2E', ['rwsprojectApp', 'ngMockE2E']).run(function ($httpBackend, $cookies) {
  // let all views through (the actual html views from the views folder should be loaded)
  $httpBackend.whenGET(new RegExp('views\/.*')).passThrough();
  $httpBackend.whenGET(new RegExp('templates\/.*')).passThrough();

  // $httpBackend.whenGET(/.*/).passThrough();
  $httpBackend.whenPOST(/.*/).passThrough();
  $httpBackend.whenPUT(/.*/).passThrough();
  $httpBackend.whenDELETE(/.*/).passThrough();

  $httpBackend.whenGET('/server/checkAccess').respond(200, {
    "role": "admin",
    "username": "admin"
  });

  $httpBackend.whenGET('/server/getProjectInfo').respond(200, mockProjectInfo);
  $httpBackend.whenGET(/\/server\/getFixtureTypes.*/).respond(200, mockFixtureTypes);
  $httpBackend.whenGET('/server/regions').respond(200, mockRegions);
  $httpBackend.whenGET('/server/getAccessories').respond(200, mockAccessories);


}).run(['$rootScope', 'dataService', function ($rootScope, dataService) {

  console.log('setting mock mode to true');
  dataService.fixtureLines = mockFixtureLines;

}]);
