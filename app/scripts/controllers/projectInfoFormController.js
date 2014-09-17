angular.module('rwsprojectApp')
    .controller('projectInfoFormController', ['$scope', '$filter', '$rootScope', 'dataService',
        function ($scope, $filter, $rootScope, dataService) {

            $scope.regions = [
                {name: 'EMEA', id:1},
                {name: 'APAC', id:2}
            ];

            $scope.tabs.tabOne = {
                dateTime: $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss a'),
                projectName: undefined,
                address: undefined,
                region: {name: 'EMEA', id:1},
                createdBy: undefined,
                basedOn: undefined,
                email: undefined,
                notes: undefined,
                region_id: 1
            };

            dataService.fetchRegions()
                .success(function(regions) {
                    $scope.regions = regions.payload;
                })
                .error(function(error){
                    $scope.$emit('error retrieving regions')
                });


            dataService.fetchProjectInfo()
                .success(function (data) {
                    console.log('received project info');
                    console.log(data);
                    $scope.tabs.tabOne = data;
                    console.log($scope.tabs.tabOne);
                })
                .error(function (data, status) {
                    // no current project
                    console.log('no active project');
                });


            $rootScope.$on('tabLosingFocus', function (stuff, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                if (fromTab === 'tab1') {

                    // allow switching to a different tab if this tab is valid
                    if ($scope.projectInfo.$valid) {
                        // send the data
                        dataService.submitProjectInfo($scope.tabs.tabOne);

                        // switch tabs
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        // once the user attempts to submit the form, mark any invalid fields
                        $scope.projectInfo.$setSubmitted();
                    }
                } else {
                    // a user is switching a different tab than ours
                    $rootScope.tabs.activeTab = toTab;
                }
            });


        }]);