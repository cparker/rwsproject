angular.module('rwsprojectApp')
  .controller('emergencyController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
    function ($scope, $filter, $rootScope, dataService, $httpBackend) {


      $rootScope.$on('entering5', function (event, fromTab, toTab) {
        $scope.selectedEmergencyRadio = dataService.emergencyOption;
      });


      $rootScope.$on('leaving5', function (event, fromTab, toTab) {
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
