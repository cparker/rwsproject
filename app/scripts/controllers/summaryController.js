angular.module('rwsprojectApp')
    .controller('summaryController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {

            $rootScope.$on('entering8', function (event, fromTab, toTab) {
                event.stopPropagation();

                // recompute every time you enter the tab
                $scope.emergencyRelayCount = dataService.emergencyOption == 1 ? 1 : 0;
                $scope.emergencyGatewayCount = dataService.emergencyOption == 2 ? 1 : 0;

                $scope.sensorThreeFixtures = _.filter(dataService.fixtureLines, function (fix) {
                    return fix.controlMethod.name === "Sensor 3";
                });

                $scope.ledGatewayFixtures = _.filter(dataService.fixtureLines, function (fix) {
                    return fix.controlMethod.name.toLowerCase().indexOf('led gateway') != -1;
                });

                $scope.s3BySensorPart = _.pairs(_.groupBy($scope.sensorThreeFixtures, function (fix) {
                    return fix.partInfo.part_number;
                }));

                $scope.ledBySensorPart = _.pairs(_.groupBy($scope.ledGatewayFixtures , function (fix) {
                    return fix.partInfo.part_number;
                }));
            });


            $rootScope.$on('leaving8', function (event, fromTab, toTab) {
                event.stopPropagation();
                $rootScope.tabs.activeTab = toTab;
            });

        }]);