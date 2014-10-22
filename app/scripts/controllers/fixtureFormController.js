angular.module('rwsprojectApp')
    .controller('fixtureFormController', ['$scope', '$filter', '$rootScope', 'dataService',
        function ($scope, $filter, $rootScope, dataService) {

            $rootScope.fixtureForm = {};
            $rootScope.fixtureForm.dropDownChoices = {};

            $scope.setFixtureTypesBySelectedRegion = function () {
                $rootScope.fixtureForm.dropDownChoices.sensorTypes = [
                    {name: 'None', id: 1},
                    {name: 'Normal', id: 2},
                    {name: 'Low', id: 3},
                    {name: 'High', id: 4}
                ];

                dataService.fetchFixtureTypes($rootScope.tabs.tabOne.region.id)
                    .success(function (types) {
                        $rootScope.fixtureForm.dropDownChoices.fixtureTypes = types.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };


            $rootScope.$on('entering2', function (stuff, fromTab, toTab) {
                $scope.setFixtureTypesBySelectedRegion();
            });

            $rootScope.$on('leaving2', function (event, fromTab, toTab) {
                event.stopPropagation();

                // let's allow going back
                if (parseInt(toTab) < 2) {
                    $rootScope.tabs.activeTab = toTab;
                } else {
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
                        $rootScope.fixtureForm.dropDownChoices.mountTypes = mounts.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    });
            };

            $scope.changeMountType = function () {

                dataService.fetchFixtureSizes($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id)
                    .success(function (sizes) {
                        $rootScope.fixtureForm.dropDownChoices.fixtureSizes = sizes.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };

            $scope.changeFixtureSize = function () {

                dataService.fetchDistributions($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id, $rootScope.fixtureForm.fixtureSize.id)
                    .success(function (distributions) {
                        $rootScope.fixtureForm.dropDownChoices.distributions = distributions.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })

            };


            $scope.changeDistribution = function () {

                dataService.fetchLumens($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id)
                    .success(function (lumens) {
                        $rootScope.fixtureForm.dropDownChoices.lumens = lumens.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })
            };


            $scope.changeLumens = function () {
                dataService.fetchChannels($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id)
                    .success(function (channels) {
                        $rootScope.fixtureForm.dropDownChoices.channels = channels.payload;
                    })
                    .error(function (er) {
                        console.log(er);
                    })

            };

            $scope.changeChannels = function () {
                dataService.fetchManufacturers($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
                    $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.channels.id)
                    .success(function (manufacturers) {
                        $rootScope.fixtureForm.dropDownChoices.manufacturers = manufacturers.payload;
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
                        $rootScope.fixtureForm.dropDownChoices.controlMethods = methods.payload;
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

                var accessoryDetails = _.map(_.pairs($rootScope.accessoryTally), function (tallyPair) {
                    return {
                        accessoryCount: tallyPair[1],
                        accessory: {
                            "description": $rootScope.accessoriesByPartNumber[tallyPair[0]].description,
                            "part_number": tallyPair[0]
                        }
                    };
                });

                if ($scope.fixtureTabForm.$valid) {
                    dataService.addFixtureLine($rootScope.fixtureForm, accessoryDetails, $rootScope.tabs.tabOne.dateTime, $rootScope.fixtureForm.dropDownChoices, dataService.fixNotes);

                    // reset the form
                    $scope.resetFixtureForm();
                }
            };

            $scope.resetFixtureForm = function () {
                $rootScope.fixtureForm = {};
                $scope.setFixtureTypesBySelectedRegion();
                dataService.fixNotes = '';
                $scope.fixtureTabForm.$setPristine();
                dataService.selectedFixtureLine = undefined;
                $rootScope.selectedAccessories = [];
                $rootScope.accessoryTally = {};
            };

            $scope.hasLineBeenAdded = function () {
                return $scope.fixtureForm.fixtureLineId != undefined;
            };

            $scope.$watch('fixtureForm.controlMethod', function (newVal, oldVal) {
                console.log('the control method just changed to ', newVal);
                var sensorDisabled = undefined;
                if ($rootScope.fixtureForm.controlMethod) {
                    sensorDisabled = $rootScope.fixtureForm.controlMethod.name != 'Sensor 3' && $rootScope.fixtureForm.controlMethod.name != 'LED Gateway';
                } else {
                    sensorDisabled = true;
                }
                $scope.sensorDisabled = sensorDisabled;
            });


        }])
;
