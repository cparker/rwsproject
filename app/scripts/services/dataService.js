angular.module('rwsprojectApp')
  .factory('dataService', ['$http', '$rootScope', function ($http, $rootScope) {

    var theService = {

      selectedFixtureLine: undefined,

      fixtureLines: [],

      fixturesByLineId: {},

      controlModel: {},

      engineModel: {},

      projectInfo: {},

      sparesModel: {},

      accessoryMasterList: {},

      fixNotes: '',

      emergencyOption: undefined,

      addFixtureLine: function (fixtureForm, selectedAccessories, projectIdDateTime, dropDownChoices, notes) {
        fixtureForm.fixtureLineId = this.fixtureLines.length;
        fixtureForm.selectedAccessories = selectedAccessories;
        fixtureForm.projectId = projectIdDateTime;
        fixtureForm.notes = notes;
        fixtureForm.dropDownChoices = JSON.parse(JSON.stringify(dropDownChoices));

        // insert at the beginning of the list
        this.fixtureLines.unshift(fixtureForm);

        // insert into a 'map' so we can refer to it by fixtureLineId
        this.fixturesByLineId[fixtureForm.fixtureLineId] = fixtureForm;

        // send it to the server
        this.submitFixtureLine(fixtureForm);
      },

      getFixtureLines: function () {
        return this.fixtureLines;
      },

      deleteFixtureLine: function (fixtureIndex) {
        this.fixtureLines.splice(fixtureIndex, 1);
      },

      updateNotesForLine: function (lineId, notes) {
        var fix = _.find(this.fixtureLines, function (l) {
          return l.fixtureLineId === lineId;
        });

        fix.notes = notes;
      },

      selectFixtureLine: function (lineId) {
        this.selectedFixtureLine = lineId;
        var formData = _.find(this.fixtureLines, function (l) {
          return l.fixtureLineId === lineId;
        });

        return formData;
      },

      isLineSelected: function (lineId) {
        return this.selectedFixtureLine === lineId;
      },


      submitProjectInfo: function (projectInfo) {

        this.projectInfo = projectInfo;

        // return the result of $http, which is a promise, so we can handle it back in the controller
        return $http({
          method: 'POST',
          url: '/server/submitProjectInfo',
          data: projectInfo
        });
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

      fetchManufacturers: function (regionId, fixtureTypeId) {
        return $http.get('/server/getManufacturers?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId);
      },

      fetchMountTypes: function (regionId, fixtureTypeId, manufacturerId) {
        return $http.get('/server/getMountTypes?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&manufacturerId=' + manufacturerId);
      },

      fetchFixtureSizes: function (regionId, fixtureTypeId, mountTypeId, manufacturerId) {
        return $http.get('/server/getFixtureSizes?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId +
        '&manufacturerId=' + manufacturerId);
      },

      fetchDistributions: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, manufacturerId) {
        return $http.get('/server/getDistributions?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId +
        '&fixtureSizeId=' + fixtureSizeId + '&manufacturerId=' + manufacturerId);
      },

      fetchLumens: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, manufacturerId) {
        return $http.get('/server/getLumens?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId +
        '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&manufacturerId=' + manufacturerId);
      },

      fetchChannels: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, manufacturerId) {
        return $http.get('/server/getChannels?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId +
        '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&manufacturerId=' + manufacturerId);
      },


      fetchControlMethods: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, channelsId, manufacturerId) {
        return $http.get('/server/getControlMethods?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId +
        '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&channelsId=' +
        channelsId + '&manufacturerId=' + manufacturerId);
      },

      getPartInfo: function (regionId, fixtureTypeId, mountTypeId, fixtureSizeId, distributionId, lumensId, channelsId, manufacturerId, controlMethodId) {
        return $http.get('/server/getPartInfo?regionId=' + regionId + '&fixtureTypeId=' + fixtureTypeId + '&mountTypeId=' + mountTypeId + '&fixtureSizeId=' + fixtureSizeId + '&distributionId=' + distributionId + '&lumensId=' + lumensId + '&channelsId=' + channelsId + '&manufacturerId=' + manufacturerId + '&controlMethodId=' + controlMethodId);
      },

      fetchAccessories: function () {
        return $http.get('/server/getAccessories')
      },

      submitFixtureLine: function (fixtureLine) {
        return $http({
          method: 'POST',
          url: '/server/submitFixture',
          data: fixtureLine
        });
      },

      getFiles: function (dir) {
        if (dir) {
          return $http.get('/server/getFiles?dir=' + dir);
        } else {
          return $http.get('/server/getFiles');
        }
      },

      checkAccess: function () {
        return $http.get('/server/checkAccess')
      },

      doLogin: function (user, password) {
        var loginData = {
          username: user,
          password: password
        };
        return $http({method: 'POST', url: '/server/login', data: loginData});
      },

      deleteFile: function (file) {
        var params = {
          url: file.url
        };
        return $http({method: 'DELETE', url: '/server/deleteFile', data: file, params: params});
      },

      signoff: function () {
        return $http({method: 'POST', url: '/server/signoff'});
      },

      sensorDisabled: false,

      engineGrandTotal: function () {
        return this.engineModel.enginesStandard +
          this.engineModel.enginesEmergency +
          this.engineModel.enginesStandardSpare +
          this.engineModel.enginesEmergencySpare;
      },

      swapFixtureDB: function() {
        return $http({
          method: 'POST',
          url: '/server/swapFixtureDB'
        });
      }

    };


    return theService;


  }]);
