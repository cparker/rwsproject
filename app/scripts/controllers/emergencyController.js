angular.module('rwsprojectApp')
    .controller('emergencyController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            $rootScope.$on('tabLosingFocus', function (event, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                if (fromTab === 'tab5') {
                    event.stopPropagation();
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