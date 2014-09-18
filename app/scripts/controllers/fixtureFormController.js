angular.module('rwsprojectApp')
    .controller('fixtureFormController', ['$scope', '$filter', '$rootScope', 'dataService',
        function ($scope, $filter, $rootScope, dataService) {

            $scope.fixtureTypes = [
                {name: 'FIXTURE ONE', id: 1},
                {name: 'FIXTURE TWO', id: 2}
            ];

            $scope.mountTypes = [
                {name: 'MOUNT ONE', id: 1},
                {name: 'MOUNT TWO', id: 2}
            ];

            $scope.fixtureSizes = [
                {name: 'SIZE ONE', id: 1},
                {name: 'SIZE TWO', id: 2}
            ];

            $scope.fixtureForm = {};

            $rootScope.$on('tabLosingFocus', function(stuff,fromTab,toTab) {
                if (toTab === 'tab2') {
                    dataService.fetchFixtureTypes($rootScope.tabs.tabOne.region.id)
                        .success(function (types) {
                            $scope.fixtureTypes = types.payload;
                        })
                        .error(function (er) {
                            console.log(er);
                        });
                }
            });


            $scope.changeFixtureType = function() {

                dataService.fetchMountTypes($rootScope.tabs.tabOne.region.id, $scope.fixtureForm.fixtureType.id)
                    .success(function (mounts) {
                        $scope.mountTypes = mounts.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };

            $scope.changeMountType = function() {

                dataService.fetchFixtureSizes($rootScope.tabs.tabOne.region.id, $scope.fixtureForm.fixtureType.id, $scope.fixtureForm.mountType.id)
                    .success(function (sizes) {
                        $scope.fixtureSizes = sizes.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };

            $scope.changeFixtureSize = function() {

            };





        }]);
