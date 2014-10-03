angular.module('rwsprojectApp')
    .controller('controlFormController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            $rootScope.$on('tabLosingFocus', function (event, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                if (fromTab === 'tab3') {
                    event.stopPropagation();
                    // TRYING TO LEAVE THE CONTROL FORM
                    if ($scope.controlForm.$valid) {
                        dataService.controlModel = $scope.controlModel;
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $scope.controlForm.$setSubmitted();
                    }

                }
            });


        }]);