angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $route) {

        $scope.tabs = {};
        $scope.tabs.activeTab = 'tab2';

        $scope.tabs.accessoriesDialogHide = true;

        $scope.tabs.rock = 'and roll';

        $scope.tabs.tabClick = function (tabId, event) {
            $scope.tabs.activeTab = tabId;
        };

        $scope.tabs.isTabActive = function (tabId) {
            return tabId == $scope.tabs.activeTab;
        };

        $scope.tabs.toggleAccessoriesDialog = function () {
            $scope.tabs.accessoriesDialogHide =
                $scope.tabs.accessoriesDialogHide == false;
        };

        // this should use $http and ask the server if the user is logged in
        // what happens when their session times out?
        $scope.isLoggedIn = true;

        $scope.tempToggleLogin = function() {
            $scope.isLoggedIn = !$scope.isLoggedIn;
        };

    });