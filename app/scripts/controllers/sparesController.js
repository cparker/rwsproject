angular.module('rwsprojectApp')
  .controller('sparesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
    function ($scope, $filter, $rootScope, dataService, $httpBackend) {

      $scope.twoSeventy = '277v';
      $scope.twoHundred = '200v-250v';

      //todo REMOVE THIS
      $scope.spareFixtureControlPct = 0.05;
      $scope.spareDimmerPct = 0.01;
      $scope.spareAccessoryPct = 0.01;
      $scope.accessorySparesChanged = false;


      // when we switch to the spares tab, we need to recompute some things
      $rootScope.$on('entering6', function (event, fromTab, toTab) {
        // only initialize these if they are not defined
        $scope.sparesModel = $scope.sparesModel == undefined ? {} : $scope.sparesModel;
        $scope.engineTotals = $scope.engineTotals == undefined ? {} : $scope.engineTotals;

        $scope.sparesModel = dataService.sparesModel || $scope.sparesModel;
        $scope.engineTotals = dataService.engineTotals || $scope.engineTotals;

        if (dataService.emergencyOption == 1) {
          $scope.emergencyKitNumber =
            dataService.engineModel.enginesStandard +
            dataService.engineModel.enginesEmergency +
            dataService.engineModel.enginesStandardSpare +
            dataService.engineModel.enginesEmergencySpare;
        } else {
          $scope.emergencyKitNumber =
            dataService.engineModel.enginesEmergency +
            dataService.engineModel.enginesEmergencySpare;
        }

        // EXCEPTION: handle birchwood 8' exception.  If the fixture is a birchwood, 8', sensor 3, we need to add a spare
        $scope.isFixtureABirchwoodEight = function (fix) {
          if (
            fix.fixtureType.name.toLowerCase() === 'linear' &&
            fix.fixtureSize.name === "8'" &&
            fix.manufacturer.name.toLowerCase() === 'birchwood' &&
            fix.controlMethod.name.toLowerCase() === 'sensor 3') {
            return true;
          } else {
            return false;
          }
        };

        // these need to get recomputed every time because they might go back and add fixtures
        $scope.sensorThreeFixtures = _.chain(dataService.fixtureLines)
          .filter(function (fix) {
            return fix.controlMethod.name.toLowerCase().indexOf('gateway') === -1;
          })
          .map(function (fix, key, list) {
            if (fix.spareControlQuantity === undefined) {
              if ($scope.isFixtureABirchwoodEight(fix)) {
                fix.spareControlQuantity = parseInt(fix.controlQuantity);
              } else {
                fix.spareControlQuantity = Math.ceil((parseInt(fix.controlQuantity) || 0) * $scope.spareFixtureControlPct);
              }
            }
            return fix;
          })
          .value();


        // these need to get recomputed every time because they might go back and add fixtures
        $scope.ledGatewayFixtures = _.chain(dataService.fixtureLines)
          .filter(function (fix) {
            return fix.controlMethod.name.toLowerCase().indexOf('gateway') != -1;
          })
          .map(function (fix, key, list) {
            if (fix.spareControlQuantity === undefined) {
              fix.spareControlQuantity = Math.ceil((parseInt(fix.controlQuantity) || 0) * $scope.spareFixtureControlPct);
            }
            return fix;
          })
          .value();

        $scope.totalChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
          return initial +
            fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity) +
            fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity)
        }, 0);

        $scope.roundedTotalChannels = Math.ceil($scope.totalChannels);
        $scope.engineTotals[$scope.twoSeventy] = 0;
        $scope.engineTotals[$scope.twoHundred] = 0;

        if (dataService.engineModel.voltageStandard) {
          $scope.engineTotals[dataService.engineModel.voltageStandard] = dataService.engineModel.enginesStandardSpare;
        }
        if (dataService.engineModel.voltageEmergency) {
          $scope.engineTotals[dataService.engineModel.voltageEmergency] = dataService.engineModel.enginesEmergencySpare;
        }
        if (dataService.engineModel.voltageEmergencyMain) {
          $scope.engineTotals[dataService.engineModel.voltageEmergencyMain] += dataService.engineModel.enginesEmergency;
        }
        if (dataService.engineModel.voltageStandardMain) {
          $scope.engineTotals[dataService.engineModel.voltageStandardMain] += dataService.engineModel.enginesStandard;
        }

        $scope.engineVoltagePairs = _.pairs($scope.engineTotals);

        $scope.allAccessories = _.flatten(_.pluck(dataService.fixtureLines, 'selectedAccessories'));

        // unique list of only acc descriptions
        $scope.uniqueAccessoryDescriptions = _.union(_.map($scope.allAccessories, function (acc) {
          return acc.accessory.description;
        }));

        // empty tally
        $scope.sparesModel.accessorySpareTally = {};

        // set a tally of 0 for each accessory.  This might add new accessories if they went back and added a fixture
        _.each($scope.uniqueAccessoryDescriptions, function (d) {
          $scope.sparesModel.accessorySpareTally[d] = 0;
        });

        // fill back in from anything we've already saved
        _.each(_.pairs(dataService.sparesModel.accessorySpareTally || {}), function (sparePair) {
          $scope.sparesModel.accessorySpareTally[sparePair[0]] = sparePair[1];
        });

        // the master list is the tally of all accessories for all fixtures
        $rootScope.masterAccessoryList = _.pairs(_.reduce(dataService.fixtureLines, function (masterAcc, fixture) {
          var accessoriesByPartNumber = _.pairs(_.groupBy(fixture.selectedAccessories, function (acc) {
            return acc.accessory.part_number;
          }));

          _.each(accessoriesByPartNumber, function (accessoryMap) {
            var partNum = accessoryMap[0];
            var desc = accessoryMap[1][0].accessory.description;
            var count = accessoryMap[1][0].accessoryCount;

            if (!masterAcc[partNum]) {
              masterAcc[partNum] = {};
            }
            masterAcc[partNum].count = (masterAcc[partNum].count || 0) + count;
            masterAcc[partNum].desc = desc; // this will overwrite the description with the same description
          });

          return masterAcc;

        }, {}));

        $scope.masterAccessoriesByDesc = {};
        _.each($rootScope.masterAccessoryList, function (acc) {
          $scope.masterAccessoriesByDesc[acc[1].desc] = acc[1].count;
        });

        // now default spares to computed values based on percentages
        $scope.sparesModel.dimmers = $scope.sparesModel.dimmers != undefined ? $scope.sparesModel.dimmers : Math.ceil(dataService.controlModel.dimmers * $scope.spareDimmerPct);
        $scope.sparesModel.sceneControllers = $scope.sparesModel.sceneControllers != undefined ? $scope.sparesModel.sceneControllers : Math.ceil(dataService.controlModel.sceneControllers * $scope.spareDimmerPct);
        $scope.sparesModel.emergencySpareControls = $scope.sparesModel.emergencySpareControls != undefined ? $scope.sparesModel.emergencySpareControls : 1;
        $scope.sparesModel.spareSharingCables = $scope.sparesModel.spareSharingCables != undefined ? $scope.sparesModel.spareSharingCables : 1;
        $scope.sparesModel.directorSpares = $scope.sparesModel.directorSpares != undefined ? $scope.sparesModel.directorSpares : 0;
        $scope.sparesModel['200v-250v'] = $scope.sparesModel['200v-250v'] != undefined ? $scope.sparesModel['200v-250v'] : 0;
        $scope.sparesModel['277v'] = $scope.sparesModel['277v'] != undefined ? $scope.sparesModel['277v'] : 0;
        $scope.sparesModel.cableSharingAdaptors = $scope.roundedTotalChannels + $scope.sparesModel.spareSharingCables;

        console.log('about to iterate over sparesModel.accessorySpareTally ' + JSON.stringify($scope.sparesModel.accessorySpareTally));
        if ($scope.accessorySparesChanged == false) {
          _.each($scope.sparesModel.accessorySpareTally, function (v, k) {
            $scope.sparesModel.accessorySpareTally[k] = Math.ceil($scope.masterAccessoriesByDesc[k] * $scope.spareAccessoryPct);
          });
        }

        $scope.$watch('sparesModel.spareSharingCables', function (newVal, oldVal) {
          $scope.sparesModel.cableSharingAdaptors = $scope.roundedTotalChannels + ($scope.sparesModel.spareSharingCables || 0);
        });

      });


      $rootScope.$on('leaving6', function (event, fromTab, toTab) {
        event.stopPropagation();

        if (parseInt(toTab) < 6) {
          // save our work so far
          dataService.sparesModel = JSON.parse(JSON.stringify($scope.sparesModel));


          $rootScope.tabs.activeTab = toTab;
        } else {
          if ($scope.sparesForm.$valid) {
            dataService.emergencyKitNumber = $scope.emergencyKitNumber;
            dataService.sparesModel = JSON.parse(JSON.stringify($scope.sparesModel));
            dataService.engineTotals = $scope.engineTotals;
            $rootScope.tabs.activeTab = toTab;
          } else {
            $scope.sparesForm.$setSubmitted();
          }
        }


      });


      // as soon as a user adjusts accessory spares, we no longer compute percentage defaults
      $scope.adjustAccessorySpares = function () {
        $scope.accessorySparesChanged = true;
      };

    }]);
