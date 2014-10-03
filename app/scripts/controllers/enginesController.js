angular.module('rwsprojectApp')
    .controller('enginesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            var channelsPerEngine = 47;

            // when we get instantiated, calculate channels
            $scope.standardChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity);
            }, 0);

            $scope.emergencyChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity);
            }, 0);

            $scope.standardEngines = Math.ceil($scope.standardChannels / channelsPerEngine);
            $scope.emergencyEngines = Math.ceil($scope.emergencyChannels / channelsPerEngine);

            $rootScope.$on('tabLosingFocus', function (event, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                if (fromTab === 'tab4') {
                    event.stopPropagation();
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