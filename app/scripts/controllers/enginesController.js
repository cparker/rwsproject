angular.module('rwsprojectApp')
    .controller('enginesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            var channelsPerEngine = 47;

            $rootScope.$on('entering4', function (event, fromTab, toTab) {
                $scope.standardChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                    return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity);
                }, 0);

                $scope.emergencyChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                    return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity);
                }, 0);

                $scope.standardEngines = Math.ceil($scope.standardChannels / channelsPerEngine);
                $scope.emergencyEngines = Math.ceil($scope.emergencyChannels / channelsPerEngine);

            });


            $rootScope.$on('leaving4', function (event, fromTab, toTab) {
                event.stopPropagation();

                if (parseInt(toTab) < 4) {
                    $rootScope.tabs.activeTab = toTab;
                } else {
                    // TRYING TO LEAVE THE FORM
                    if ($scope.enginesForm.$valid) {
                        dataService.engineModel = $scope.engineModel;
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $scope.enginesForm.$setSubmitted();
                    }
                }

            });


        }]);