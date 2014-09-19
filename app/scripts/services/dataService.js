angular.module('rwsprojectApp')
    .factory('dataService', ['$http', function ($http) {


        var theService = {

            selectedFixtureLine: undefined,

            fixtureLines: [],

            addFixtureLine: function (fixtureForm) {
                fixtureForm.fixtureLineId = this.fixtureLines.length + 1;
                this.fixtureLines.push(fixtureForm);
            },

            getFixtureLines: function () {
                return this.fixtureLines;
            },

            deleteFixtureLine: function (lineId) {
                var delIndex = undefined;
                for (var i = 0; i < this.fixtureLines.length; i++) {
                    if (lineId === this.fixtureLines[i][this.fixtureLineId]) {

                    }
                }
                this.fixtureLines.splice(delIndex, 1);
            },

            selectFixtureLine: function (lineId) {
                this.selectedFixtureLine = lineId;
                return _.find(this.fixtureLines, function (l) {
                    return l.fixtureLineId === lineId;
                })
            },

            isLineSelected: function (lineId) {
                return this.selectedFixtureLine === lineId;
            },


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
            },

            fetchDistributions: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId) {
                return $http.get('/server/getDistributions?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId);
            },

            fetchLumens: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId) {
                return $http.get('/server/getLumens?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId);
            },

            fetchChannels: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId) {
                return $http.get('/server/getChannels?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId);
            },

            fetchManufacturers: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, channelsId) {
                return $http.get('/server/getManufacturers?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&channelsId=' + channelsId);
            },

            fetchControlMethods: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, channelsId, manufacturerId) {
                return $http.get('/server/getControlMethods?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&channelsId=' + channelsId + '&manufacturerId=' + manufacturerId);
            },

            getPartInfo: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, channelsId, manufacturerId, controlMethodId) {
                return $http.get('/server/getPartInfo?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&channelsId=' + channelsId + '&manufacturerId=' + manufacturerId + '&controlMethodId=' + controlMethodId);
            }


        };


        return theService;


    }])
;