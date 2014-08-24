angular.module('rwsprojectApp')
    .controller('tabController', function ($scope,$route) {
        console.log('route is ' , $route.current);

        $scope.tabs = {};
        $scope.tabs.activeTab = 'tab2';

        $scope.tabs.rock = 'and roll';

        $scope.tabs.tabClick = function(tabId,event) {
            $scope.tabs.activeTab = tabId;
            console.log('active tab is now ' + $scope.tabs.activeTab);
        };

        $scope.tabs.isTabActive = function(tabId) {
            console.log('does ' + tabId + ' == ' + $scope.tabs.activeTab + ' : ' + (tabId == $scope.tabs.activeTab));
            return tabId == $scope.tabs.activeTab;
        };

    });