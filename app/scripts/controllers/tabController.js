angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $rootScope, $route, $http, $filter, dataService, $routeParams) {

        $scope.user = {};

        $rootScope.tabs = {};
        $rootScope.tabs.activeTab = '1';

        if ($routeParams.tab != undefined) {
            $rootScope.tabs.activeTab = $routeParams.tab;
        }

        $scope.selectedLineId = undefined;

        $rootScope.tabs.accessoriesDialogHide = true;
        $rootScope.tabs.notesDialogHide = true;

        $scope.regions = [ ];
        $scope.selectedRegion = 0;

        $scope.accessories = [];
        $rootScope.selectedAccessories = [];
        $rootScope.accessoryTally = {};

        $scope.activeSummarySection = 'menu';

        $rootScope.exclusionNotes = "";

        $scope.deleteFixtureAckShow = false;

        dataService.fetchAccessories()
            .success(function (ac) {
                $scope.accessories = ac.payload;
                $rootScope.accessoriesByDescription = {};
                $rootScope.accessoriesByPartNumber = {};

                _.each($scope.accessories, function (a) {
                    $rootScope.accessoriesByDescription[a.description] = a;
                });

                _.each($scope.accessories, function (a) {
                    $rootScope.accessoriesByPartNumber[a.part_number] = a;
                });

            }).error(function (er) {
                $scope.$emit('error', 'Failed to fetch accessories ' + JSON.stringify(er));
            });

        // we're passed the array index of the fixture to delete from fixtureLines
        $scope.deleteFixtureLine = function (lineIndex) {
            $scope.fixtureDeleteChoice = lineIndex;
            $scope.deleteFixtureAckShow = true;
        };

        $scope.deleteFixtureLineYes = function () {
            $scope.deleteFixtureAckShow = false;
            dataService.deleteFixtureLine($scope.fixtureDeleteChoice);
        };

        $scope.fixtureLineSelect = function (line) {
            var result = dataService.selectFixtureLine(line.fixtureLineId);
            // restore all the drop down lists with the right choices
            $rootScope.dropDownChoices = result.dropDownChoices;

            // set the form based on the selected line
            $rootScope.fixtureForm = result;

            dataService.fixNotes = result.notes;
            $rootScope.selectedAccessories = result.selectedAccessories;
            $rootScope.accessoryTally = {};

            _.each($rootScope.selectedAccessories, function (sa) {
                $rootScope.accessoryTally[sa.accessory.part_number] = sa.accessoryCount;
            });
        };

        $scope.isLineSelected = function (line) {
            return dataService.isLineSelected(line.fixtureLineId);
        };

        $scope.tabs.tabClick = function (tabId, $event) {
            $scope.$emit('leaving' + $scope.tabs.activeTab, $scope.tabs.activeTab, tabId);
            $scope.$emit('entering' + tabId, $scope.tabs.activeTab, tabId);
        };

        $scope.tabs.isTabActive = function (tabId) {
            return tabId == $scope.tabs.activeTab;
        };

        $scope.tabs.toggleAccessoriesDialog = function () {
            if ($scope.tabs.accessoriesDialogHide == false) {
                // it is open and we are closing it
                $rootScope.fixtureForm.selectedAccessories = _.map(_.pairs($rootScope.accessoryTally), function (tallyPair) {
                    return {
                        accessoryCount: tallyPair[1],
                        accessory: {
                            "description": $rootScope.accessoriesByPartNumber[tallyPair[0]].description,
                            "part_number": tallyPair[0]
                        }
                    };
                });
            }
            $scope.tabs.accessoriesDialogHide =
                $scope.tabs.accessoriesDialogHide == false;
        };

        $scope.isAccessorySelected = function (accPartNum) {
            return $rootScope.accessoryTally[accPartNum] && $rootScope.accessoryTally[accPartNum] > 0;
        };

        $scope.tabs.toggleNotesDialog = function () {
            // this means they are updating a selected line with new notes
            if (dataService.selectedFixtureLine != undefined) {
                dataService.updateNotesForLine(dataService.selectedFixtureLine, dataService.fixNotes);
            }

            $scope.tabs.notesDialogHide =
                $scope.tabs.notesDialogHide == false;
        };


        $rootScope.tempToggleLogin = function () {
            $rootScope.isLoggedIn = !$rootScope.isLoggedIn;
        };


        $scope.getFixtureLines = function () {
            return dataService.getFixtureLines();
        };

        $scope.tabClass = function (boldClass, dimClass, selectedTab) {
            if (selectedTab == $rootScope.tabs.activeTab) {
                return boldClass;
            } else {
                return dimClass;
            }
        };

        $scope.selectSummary = function (section) {
            $scope.activeSummarySection = section;
        };


        $scope.testBroadcast = function (one, two) {
            console.log('emiting event ' + one + ' ' + two);
            $scope.$emit(one, two);
        };

        // this is here because there is no exclusions tab controller
        $rootScope.$on('leaving7', function (event, fromTab, toTab) {
            event.stopPropagation();
            $rootScope.tabs.activeTab = toTab;

        });


    });
