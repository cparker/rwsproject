angular.module('rwsprojectApp')
    .controller('controlFormController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {

            $rootScope.$on('entering3', function (event, fromTab, toTab) {
                event.stopPropagation();
                // defaults for non required fields
                $scope.controlModel = $scope.controlModel ? $scope.controlModel : {};

                $scope.controlModel.sceneControllers = $scope.controlModel.sceneControllers || 0;
                $scope.controlModel.dimmers = $scope.controlModel.dimmers || 0;
                $scope.controlModel.spdtSwitches = $scope.controlModel.spdtSwitches || 0;
            });


            $rootScope.$on('leaving3', function (event, fromTab, toTab) {
                event.stopPropagation();

                // back
                if (parseInt(toTab) < 3) {
                    $rootScope.tabs.activeTab = toTab;
                } else {

                    // forward
                    if ($scope.controlForm.$valid) {

                        $scope.totalChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                            return initial +
                                fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity) +
                                fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity)
                        }, 0);

                        $scope.controlModel = $scope.controlModel ? $scope.controlModel : {};
                        $scope.controlModel.totalSharingCables = $scope.totalChannels;
                        dataService.controlModel = $scope.controlModel;
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $scope.controlForm.$setSubmitted();
                    }
                }

            });


        }]);