angular.module('rwsprojectApp')
    .controller('controlFormController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


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

                        $scope.controlModel.totalSharingCables = $scope.totalChannels;
                        dataService.controlModel = $scope.controlModel;
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $scope.controlForm.$setSubmitted();
                    }
                }

            });


        }]);