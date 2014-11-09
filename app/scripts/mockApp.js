'use strict';


angular.module('rwsprojectAppE2E', ['rwsprojectApp', 'ngMockE2E']).run(function ($httpBackend, $cookies) {
    // let all views through (the actual html views from the views folder should be loaded)
    $httpBackend.whenGET(new RegExp('views\/.*')).passThrough();

    // Mock out the call to '/server/hello'
    $httpBackend.whenGET('/server/hello').respond(200, {message: 'world'});
    // Respond with 404 for all other service calls
    $httpBackend.whenGET(new RegExp('service\/.*')).respond(404);

    // replace this all with mock data
    // todo : have the python server simply log requests with beautified JSON so it's easy to copy
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();


});