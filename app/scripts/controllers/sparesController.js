angular.module('rwsprojectApp')
    .controller('sparesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {



            //todo REMOVE THIS
            $scope.fixLines = dataService.fixtureLines;

            $scope.parseInt = parseInt;
            $scope.sparesModel = {};

            $scope.engineModel = dataService.engineModel;
            $scope.controlModel = dataService.controlModel;

            $scope.sensorThreeFixtures = _.filter(dataService.fixtureLines, function (fix) {
                return fix.controlMethod.name === "Sensor 3";
            });

            $scope.ledGatewayFixtures = _.filter(dataService.fixtureLines, function (fix) {
                return fix.controlMethod.name === "LED Gateway";
            });

            $scope.engineTotals = {};

            $scope.engineTotals[dataService.engineModel.voltageStandard] = dataService.engineModel.enginesStandard;
            $scope.engineTotals[dataService.engineModel.voltageEmergency] =
                dataService.engineModel.enginesEmergency + ($scope.engineTotals[dataService.engineModel.voltageEmergency] || 0);

            $scope.engineVoltagePairs = _.pairs($scope.engineTotals);

            $scope.cableSharingAdaptorCount = dataService.controlModel.useSharedCable ? 1 : 0;

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

        }]);