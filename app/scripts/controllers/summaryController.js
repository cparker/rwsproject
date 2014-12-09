angular.module('rwsprojectApp')
  .controller('summaryController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
    function ($scope, $filter, $rootScope, dataService, $httpBackend) {

      $rootScope.$on('entering8', function (event, fromTab, toTab) {
        event.stopPropagation();
      });

      $rootScope.$on('leaving8', function (event, fromTab, toTab) {
        event.stopPropagation();
        $rootScope.tabs.activeTab = toTab;
      });

    }]);
