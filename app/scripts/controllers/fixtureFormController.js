angular.module('rwsprojectApp')
    .controller('fixtureFormController', ['$scope', '$filter', '$rootScope', 'dataService',
        function ($scope, $filter, $rootScope, dataService) {

            $rootScope.dropDownChoices = {

                fixtureTypes: [
                    {name: 'FIXTURE ONE', id: 1},
                    {name: 'FIXTURE TWO', id: 2}
                ],

                mountTypes: [
                    {name: 'MOUNT ONE', id: 1},
                    {name: 'MOUNT TWO', id: 2}
                ],

                fixtureSizes: [
                    {name: 'SIZE ONE', id: 1},
                    {name: 'SIZE TWO', id: 2}
                ],

                distributions: [
                    {name: 'dist1', id: 1},
                    {name: 'dist2', id: 2}
                ],

                lumens: [
                    {name: '100', id: 1},
                    {name: '200', id: 2}
                ],

                channels: [
                    {name: '1', id: 1},
                    {name: '2', id: 2}
                ],

                manufacturers: [
                    {name: 'm1', id: 1},
                    {name: 'm2', id: 2}
                ],

                controlMethods: [
                    {name: 'c1', id: 1},
                    {name: 'c2', id: 2}
                ],

                sensorTypes: [
                    {name: 'None', id: 1},
                    {name: 'Normal', id: 2},
                    {name: 'Low', id: 3},
                    {name: 'High', id: 4}
                ]
            };

            $rootScope.fixtureForm = {};


            $scope.setFixtureTypesBySelectedRegion = function () {
                $rootScope.dropDownChoices.sensorTypes = [
                    {name: 'None', id: 1},
                    {name: 'Normal', id: 2},
                    {name: 'Low', id: 3},
                    {name: 'High', id: 4}
                ];

                dataService.fetchFixtureTypes($rootScope.tabs.tabOne.region.id)
                    .success(function (types) {
                        $rootScope.dropDownChoices.fixtureTypes = types.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };


            $rootScope.$on('tabLosingFocus', function (stuff, fromTab, toTab) {
                if (toTab === 'tab2') {
                    $scope.setFixtureTypesBySelectedRegion();
                }
            });

            $rootScope.$on('tabLosingFocus', function (event, fromTab, toTab) {
                // check to see if the tab being switched is tab1
                if (fromTab === 'tab2') {
                    event.stopPropagation();
                    // TRYING TO LEAVE THE FIXTURE FORM
                    if (dataService.fixtureLines.length > 0) {
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $rootScope.$emit('error', 'Please add some fixtures before continuing');
                    }
                }
            });

            $scope.changeFixtureType = function () {

                dataService.fetchMountTypes($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id)
                    .success(function (mounts) {
                        $rootScope.dropDownChoices.mountTypes = mounts.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };

            $scope.changeMountType = function () {

                dataService.fetchFixtureSizes($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id)
                    .success(function (sizes) {
                        $rootScope.dropDownChoices.fixtureSizes = sizes.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };

            $scope.changeFixtureSize = function () {

                dataService.fetchDistributions($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id, $rootScope.fixtureForm.fixtureSize.id)
                    .success(function (distributions) {
                        $rootScope.dropDownChoices.distributions = distributions.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })

            };


            $scope.changeDistribution = function () {

                dataService.fetchLumens($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id)
                    .success(function (lumens) {
                        $rootScope.dropDownChoices.lumens = lumens.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };


            $scope.changeLumens = function () {
                dataService.fetchChannels($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id)
                    .success(function (channels) {
                        $rootScope.dropDownChoices.channels = channels.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })

            };

            $scope.changeChannels = function () {
                dataService.fetchManufacturers($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.channels.id)
                    .success(function (manufacturers) {
                        $rootScope.dropDownChoices.manufacturers = manufacturers.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };

            $scope.changeManufacturers = function () {
                dataService.fetchControlMethods($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.channels.id,
                    $rootScope.fixtureForm.manufacturer.id)
                    .success(function (methods) {
                        $rootScope.dropDownChoices.controlMethods = methods.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };


            $scope.changeControlMethod = function () {
                dataService.getPartInfo($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.channels.id,
                    $rootScope.fixtureForm.manufacturer.id, $rootScope.fixtureForm.controlMethod.id)
                    .success(function (partInfo) {
                        $rootScope.fixtureForm.partInfo = partInfo.payload[0];
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };

            $scope.addFixtureLine = function () {
                $scope.fixtureTabForm.$setSubmitted();

                var accessoryDetails = _.map($rootScope.selectedAccessories, function (accessoryCount, accessoryIndex) {
                    return {
                        accessoryCount: accessoryCount,
                        accessory: $scope.accessories[accessoryIndex]
                    };
                });

                var filteredAccessoryDetails = _.filter(accessoryDetails, function (d) {
                    return d.accessoryCount != undefined;
                });

                if ($scope.fixtureTabForm.$valid) {
                    dataService.addFixtureLine($rootScope.fixtureForm, filteredAccessoryDetails, $rootScope.tabs.tabOne.dateTime, $rootScope.dropDownChoices, $rootScope.copiedFixtureNotes);
                }
            };

            $scope.resetFixtureForm = function () {
                $rootScope.fixtureForm = {};
                $rootScope.dropDownChoices = {};
                $scope.setFixtureTypesBySelectedRegion();
                $rootScope.fixtureNotes = "";
                $scope.fixtureTabForm.$setPristine();
                dataService.selectedFixtureLine = undefined;
                $rootScope.selectedAccessories = [];
            };

            $scope.hasLineBeenAdded = function () {
                return $scope.fixtureForm.fixtureLineId != undefined;
            };

        }])
;
