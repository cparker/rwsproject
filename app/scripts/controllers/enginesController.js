angular.module('rwsprojectApp')
  .controller('enginesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
    function ($scope, $filter, $rootScope, dataService, $httpBackend) {


      var channelsPerEngine = 47;
      var enginesPerDirector = 41;

      $scope.defaultsAdjusted = false;

      $rootScope.directorCords = [
        {name: 'Director Power Cord - Australia', part: 'PC-DIR-AUS'},
        {name: 'Director Power Cord - China', part: 'PC-DIR-CHINA'},
        {name: 'Director Power Cord - EU', part: 'PC-DIR-EU'},
        {name: 'Director Power Cord - UK', part: 'PC-DIR-UK'},
        {name: 'Director Power Cord - US/Canada', part: 'included'}
      ];

      var cordOptions277 = [
        'Included'
      ];

      var cordOptions250 = [
        'US/Canada PC-NA-250',
        'European Union PC-EU-120-250',
        'UK, Hong Kong, Singapore PC-UK-120-250',
        'Australia / New Zealand PC-AUS-120-250',
        'Brazil PC-BRAZIL',
        'China PC-CHINA',
        'Denmark PC-DENMARK',
        'Switzerland PC-SWISS',
        'Excluded'
      ];

      $rootScope.cordPartNums = {
        'US/Canada PC-NA-250': 'PC-NA-250',
        'European Union PC-EU-120-250': 'PC-EU-120-250',
        'UK, Hong Kong, Singapore PC-UK-120-250': 'PC-UK-120-250',
        'Australia / New Zealand PC-AUS-120-250': 'PC-AUS-120-250',
        'Brazil PC-BRAZIL': 'PC-BRAZIL',
        'China PC-CHINA': 'PC-CHINA',
        'Denmark PC-DENMARK': 'PC-DENMARK',
        'Switzerland PC-SWISS': 'PC-SWISS',
        'Excluded': ''
      };

      $scope.disableStandardCord = false;
      $scope.disableEmergencyCord = false;

      $rootScope.$on('entering4', function (event, fromTab, toTab) {

        $scope.engineModel = dataService.engineModel || $scope.engineModel;

        // watchers for the MAIN engines
        $scope.$watch('engineModel.voltageStandardMain', function (newVal, oldVal) {
          if (newVal == '277v') {
            $scope.disableStandardCordMain = true;
            $scope.cordOptionsStandardMain = cordOptions277;
            $scope.engineModel.cordStandardMain = 'Included'
          } else {
            $scope.disableStandardCordMain = false;
            $scope.cordOptionsStandardMain = cordOptions250;
          }
        });

        $scope.$watch('engineModel.voltageEmergencyMain', function (newVal, oldVal) {
          if (newVal == '277v') {
            $scope.disableEmergencyCordMain = true;
            $scope.cordOptionsEmergencyMain = cordOptions277;
            $scope.engineModel.cordEmergencyMain = 'Included'
          } else {
            $scope.disableEmergencyCordMain = false;
            $scope.cordOptionsEmergencyMain = cordOptions250;
          }
        });


        // watchers for the SPARE engines
        $scope.$watch('engineModel.voltageStandard', function (newVal, oldVal) {
          if (newVal == '277v') {
            $scope.disableStandardCord = true;
            $scope.cordOptionsStandard = cordOptions277;
            $scope.engineModel.cordStandard = 'Included'
          } else {
            $scope.disableStandardCord = false;
            $scope.cordOptionsStandard = cordOptions250;
          }
        });

        $scope.$watch('engineModel.voltageEmergency', function (newVal, oldVal) {
          if (newVal == '277v') {
            $scope.disableEmergencyCord = true;
            $scope.cordOptionsEmergency = cordOptions277;
            $scope.engineModel.cordEmergency = 'Included'
          } else {
            $scope.disableEmergencyCord = false;
            $scope.cordOptionsEmergency = cordOptions250;
          }
        });

        $scope.engineModel = $scope.engineModel ? $scope.engineModel : {};

        $scope.standardChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
          return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity) * (fixtureRec.controlMethod.multiplier || 1.0);
        }, 0);

        $scope.emergencyChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
          return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity);
        }, 0);

        $scope.engineModel = $scope.engineModel ? $scope.engineModel : {};

        if (!$scope.defaultsAdjusted) {
          $scope.engineModel.enginesStandard = Math.ceil($scope.standardChannels / channelsPerEngine);
          $scope.engineModel.enginesEmergency = Math.ceil($scope.emergencyChannels / channelsPerEngine);
          $scope.engineModel.directorCount = Math.ceil(($scope.engineModel.enginesStandard + $scope.engineModel.enginesEmergency) / enginesPerDirector)
        }

        // defaults
        $scope.engineModel.platesStandard = $scope.engineModel.platesStandard || 0;
        $scope.engineModel.platesEmergency = $scope.engineModel.platesEmergency || 0;
        $scope.engineModel.enginesStandardSpare = $scope.engineModel.enginesStandardSpare || 0;
        $scope.engineModel.enginesEmergencySpare = $scope.engineModel.enginesEmergencySpare || 0;
      });


      $rootScope.$on('leaving4', function (event, fromTab, toTab) {
        event.stopPropagation();

        if (parseInt(toTab) < 4) {
          $rootScope.tabs.activeTab = toTab;
        } else {
          // TRYING TO MOVE FORWARD

          // summarize the main and additional engines
          $scope.cordTotals = {};
          if ($scope.engineModel.cordStandardMain && $scope.engineModel.cordStandardMain != 'Included') {
            $scope.cordTotals[$scope.engineModel.cordStandardMain] = ($scope.cordTotals[$scope.engineModel.cordStandardMain] || 0) + $scope.engineModel.enginesStandard;
          }
          if ($scope.engineModel.cordEmergencyMain && $scope.engineModel.cordEmergencyMain != 'Included') {
            $scope.cordTotals[$scope.engineModel.cordEmergencyMain] = ($scope.cordTotals[$scope.engineModel.cordEmergencyMain] || 0) + $scope.engineModel.enginesEmergency;
          }
          if ($scope.engineModel.cordStandard && $scope.engineModel.cordStandard != 'Included') {
            $scope.cordTotals[$scope.engineModel.cordStandard] = ($scope.cordTotals[$scope.engineModel.cordStandard] || 0) + $scope.engineModel.enginesStandardSpare;
          }
          if ($scope.engineModel.cordEmergency && $scope.engineModel.cordEmergency != 'Included') {
            $scope.cordTotals[$scope.engineModel.cordEmergency] = ($scope.cordTotals[$scope.engineModel.cordEmergency] || 0) + $scope.engineModel.enginesEmergencySpare;
          }
          dataService.cordTotals = $scope.cordTotals;
          dataService.cordTotalPairs = _.pairs($scope.cordTotals);

          if ($scope.enginesForm.$valid) {
            dataService.engineModel = $scope.engineModel;
            $rootScope.tabs.activeTab = toTab;
          } else {
            $scope.enginesForm.$setSubmitted();
          }
        }

      });


    }]);
