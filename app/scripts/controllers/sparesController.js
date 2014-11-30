angular.module('rwsprojectApp')
  .controller('sparesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
    function ($scope, $filter, $rootScope, dataService, $httpBackend) {

      //todo REMOVE THIS

      $scope.parseInt = parseInt;


      // when we switch to the spares tab, we need to recompute some things
      $rootScope.$on('entering6', function (event, fromTab, toTab) {
        // only initialize these if they are not defined
        $scope.sparesModel = $scope.sparesModel == undefined ? {} : $scope.sparesModel;
        $scope.engineTotals = $scope.engineTotals == undefined ? {} : $scope.engineTotals;

        $scope.emergencyKitNumber = dataService.emergencyOption == 1 || dataService.emergencyOption == 2 ? 1 : 0;

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
            return fix.controlMethod.name === "Sensor 3";
          })
          .map(function (fix) {
            if (!fix.spareControlQuantity) {
              if ($scope.isFixtureABirchwoodEight(fix)) {
                fix.spareControlQuantity = parseInt(fix.controlQuantity);
              } else {
                fix.spareControlQuantity = 0;
              }
            }
            return fix;
          })
          .value();


        // these need to get recomputed every time because they might go back and add fixtures
        $scope.ledGatewayFixtures = _.chain(dataService.fixtureLines)
          .filter(function (fix) {
            return fix.controlMethod.name.toLowerCase().indexOf('led gateway') != -1;
          })
          .map(function (fix) {
            if (!fix.spareControlQuantity) {
              fix.spareControlQuantity = 0;
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

        if (dataService.engineModel.voltageStandard) {
          $scope.engineTotals[dataService.engineModel.voltageStandard] = dataService.engineModel.enginesStandard;
        }
        if (dataService.engineModel.voltageEmergency) {
          $scope.engineTotals[dataService.engineModel.voltageEmergency] = dataService.engineModel.enginesEmergency;
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
        $scope.masterAccessoryList = _.pairs(_.reduce(dataService.fixtureLines, function (masterAcc, fixture) {
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

        // now default spares to 0
        $scope.sparesModel.dimmers = $scope.sparesModel.dimmers ? $scope.sparesModel.dimmers : 0;
        $scope.sparesModel.sceneControllers = $scope.sparesModel.sceneControllers ? $scope.sparesModel.sceneControllers : 0;
        $scope.sparesModel.emergencySpareControls = $scope.sparesModel.emergencySpareControls ? $scope.sparesModel.emergencySpareControls : 0;
        $scope.sparesModel.spareSharingCables = $scope.sparesModel.spareSharingCables ? $scope.sparesModel.spareSharingCables : 0;
        $scope.sparesModel.directorSpares = $scope.sparesModel.directorSpares ? $scope.sparesModel.directorSpares : 0;
        $scope.sparesModel['200v-250v'] = $scope.sparesModel['200v-250v'] ? $scope.sparesModel['200v-250v'] : 0;
        $scope.sparesModel['277v'] = $scope.sparesModel['277v'] ? $scope.sparesModel['277v'] : 0;

        $scope.sparesModel.cableSharingAdaptors = $scope.roundedTotalChannels + $scope.sparesModel.spareSharingCables;


      });


      $rootScope.$on('leaving6', function (event, fromTab, toTab) {
        event.stopPropagation();

        if (parseInt(toTab) < 6) {
          // save our work so far
          dataService.sparesModel = JSON.parse(JSON.stringify($scope.sparesModel));

          $rootScope.tabs.activeTab = toTab;
        } else {
          if ($scope.sparesForm.$valid) {
            dataService.sparesModel = JSON.parse(JSON.stringify($scope.sparesModel));
            $rootScope.tabs.activeTab = toTab;
          } else {
            $scope.sparesForm.$setSubmitted();
          }
        }

      });

      $scope.$watch('sparesModel.spareSharingCables', function(newVal, oldVal) {
        $scope.sparesModel.cableSharingAdaptors = $scope.roundedTotalChannels + ($scope.sparesModel.spareSharingCables || 0);
      });

    }]);
