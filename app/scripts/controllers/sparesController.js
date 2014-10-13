angular.module('rwsprojectApp')
    .controller('sparesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {

            //todo REMOVE THIS

            $scope.parseInt = parseInt;


            // when we switch to the spares tab, we need to recompute some things
            $rootScope.$on('entering6', function (event, fromTab, toTab) {
                $scope.sparesModel = {};
                $scope.engineTotals = {};

                $scope.emergencyKitNumber = dataService.emergencyOption == 1 || dataService.emergencyOption == 2 ? 1 : 0;

                $scope.sensorThreeFixtures = _.filter(dataService.fixtureLines, function (fix) {
                    return fix.controlMethod.name === "Sensor 3";
                });

                $scope.ledGatewayFixtures = _.filter(dataService.fixtureLines, function (fix) {
                    return fix.controlMethod.name === "LED Gateway";
                });

                $scope.totalChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                    return initial +
                        fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity) +
                        fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity)
                }, 0);

                $scope.engineTotals[dataService.engineModel.voltageEmergency] =
                    dataService.engineModel.enginesEmergency + ($scope.engineTotals[dataService.engineModel.voltageEmergency] || 0);

                $scope.engineTotals[dataService.engineModel.voltageStandard] = 0;
                $scope.engineTotals[dataService.engineModel.voltageEmergency] = 0;
                $scope.engineTotals[dataService.engineModel.voltageStandard] = dataService.engineModel.enginesStandard;
                $scope.engineTotals[dataService.engineModel.voltageEmergency] += dataService.engineModel.enginesEmergency;

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

        }]);