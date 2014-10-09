angular.module('rwsprojectApp')
    .controller('summaryController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {

            $scope.projectInfo = dataService.projectInfo;

            $scope.fixtures = dataService.fixtureLines;

            $scope.sparesModel = dataService.sparesModel;

            $scope.controlModel = dataService.controlModel;

            $scope.emergencyRelayCount = dataService.emergencyOption == 1 ? 1 : 0;
            $scope.emergencyGatewayCount = dataService.emergencyOption == 2 ? 1 : 0;

            $scope.sensorThreeFixtures = _.filter(dataService.fixtureLines, function (fix) {
                return fix.controlMethod.name === "Sensor 3";
            });

            $scope.ledGatewayFixtures = _.filter(dataService.fixtureLines, function (fix) {
                return fix.controlMethod.name === "LED Gateway";
            });
            $scope.s3BySensorPart = _.pairs(_.groupBy($scope.sensorThreeFixtures, function (fix) {
                return fix.partInfo.part_number;
            }));

            $scope.ledBySensorPart = _.pairs(_.groupBy($scope.ledGatewayFixtures , function (fix) {
                return fix.partInfo.part_number;
            }));

        }]);