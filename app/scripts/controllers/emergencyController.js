angular.module('rwsprojectApp')
    .controller('emergencyController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            $rootScope.$on('leaving5', function (event, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                event.stopPropagation();

                if (parseInt(toTab) < 5) {
                    $rootScope.tabs.activeTab = toTab;
                } else {
                    if ($scope.selectedEmergencyRadio) {
                        $rootScope.tabs.activeTab = toTab;
                        dataService.emergencyOption = $scope.selectedEmergencyRadio;
                    } else {
                        $rootScope.$emit('error', 'Please choose an emergency lighting solution before continuing');
                    }
                }
            });

            $scope.selectEmergencyRadio = function (radioId) {
                $scope.selectedEmergencyRadio = radioId;
            };

        }]);