angular.module('rwsprojectApp')
    .controller('printSummaryCtrl', ['$scope', '$filter', '$rootScope', 'dataService', '$window',
        function ($scope, $filter, $rootScope, dataService, $window) {

            $rootScope.printSummaryActive = true;

            $scope.goSummary = function () {
                $rootScope.printSummaryActive = false;
                $window.location = '#/home/8';
            };

            $scope.emergencyRelayCount = dataService.emergencyOption == 1 ? 1 + (dataService.sparesModel.emergencySpareControls || 0) : 0;
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

            $scope.ledBySensorPart = _.pairs(_.groupBy($scope.ledGatewayFixtures, function (fix) {
                return fix.partInfo.part_number;
            }));

        }]);
