angular.module('rwsprojectApp')
    .factory('dataService', ['$http', function ($http) {


        var theService = {

            submitProjectInfo: function (projectInfo) {

                // return the result of $http, which is a promise, so we can handle it back in the controller
                return $http({
                    method: 'POST',
                    url: '/server/submitProjectInfo',
                    data: projectInfo});
            },

            fetchProjectInfo: function () {
                // gets the current project info using the current project ID in the session
                return $http({
                    method: 'GET',
                    url: '/server/getProjectInfo'
                });
            },

            fetchRegions: function () {
                return $http.get('/server/regions')
            },

            fetchFixtureTypes: function (regionId) {
                return $http.get('/server/getFixtureTypes?regionId=' + regionId);
            },

            fetchMountTypes: function (regionId, fixtureTypeId) {
                return $http.get('/server/getMountTypes?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId);
            },

            fetchFixtureSizes: function (regionId, fixtureTypeId, mountTypeId) {
                return $http.get('/server/getFixtureSizes?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId);
            }

        };


        return theService;


    }]);