angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $rootScope, $route, $http, $filter, dataService) {

        $scope.user = {};

        $rootScope.tabs = {};
        $rootScope.tabs.activeTab = 'tab6';

        $scope.selectedLineId = undefined;

        $rootScope.tabs.accessoriesDialogHide = true;
        $rootScope.tabs.notesDialogHide = true;

        $scope.regions = [ ];
        $scope.selectedRegion = 0;

        $scope.accessories = [];

        $rootScope.selectedAccessories = [];
        $rootScope.fixtureNotes = 'these are notes';

        $scope.activeSummarySection = 'menu';

        dataService.fetchAccessories()
            .success(function (ac) {
                $scope.accessories = ac.payload;

            }).error(function (er) {
                $scope.$emit('httpError', 'Failed to fetch accessories ' + er);
            });

        $scope.deleteFixtureLine = function (lineId) {
            dataService.deleteFixtureLine(lineId);
        };

        $scope.fixtureLineSelect = function (line) {
            var result = dataService.selectFixtureLine(line.fixtureLineId);
            // restore all the drop down lists with the right choices
            $rootScope.dropDownChoices = result[1];

            // set the form based on the selected line
            $rootScope.fixtureForm = result[0];
        };

        $scope.isLineSelected = function (line) {
            return dataService.isLineSelected(line.fixtureLineId);
        };

        $scope.tabs.tabClick = function (tabId, $event) {
            $scope.$emit('tabLosingFocus', $scope.tabs.activeTab, tabId);
            // $scope.tabs.activeTab = tabId;
        };

        $scope.tabs.isTabActive = function (tabId) {
            return tabId == $scope.tabs.activeTab;
        };

        $scope.tabs.toggleAccessoriesDialog = function () {
            $scope.tabs.accessoriesDialogHide =
                $scope.tabs.accessoriesDialogHide == false;
        };

        $scope.tabs.toggleNotesDialog = function () {
            // this seems silly
            $rootScope.copiedFixtureNotes = $scope.fixtureNotes;
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
        }

    });
