angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $rootScope, $route, $http) {

        $rootScope.thing = "HAHAHA";

        $rootScope.isLoggedIn = undefined;

        $scope.invalidCredentials = false;

        $scope.tabs = {};
        $scope.user = {};
        $scope.tabs.activeTab = 'tab1';

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


        // this is our main controller, so whenever this guy runs, let's check to
        // see if we're logged in or not
        $http.get('/server/checkAccess')
            .success(function () {
                console.log('we are logged in');
                $rootScope.isLoggedIn = true;
                $scope.$emit('loggedInChanged', true);
            })
            .error(function () {
                console.log('we are not logged in');
                $rootScope.isLoggedIn = true;
                $scope.$emit('loggedInChanged', false);
            });

        $rootScope.tempToggleLogin = function () {
            $rootScope.isLoggedIn = !$rootScope.isLoggedIn;
        };

        $scope.doLogin = function () {
            var loginData = {
                username: $scope.user.name,
                password: $scope.user.password
            };

            $http({method: 'POST', url: '/server/login', data: loginData})
                .success(function (data, status) {
                    $rootScope.isLoggedIn = true;
                    $scope.invalidCredentials = false;
                    $scope.$emit('loggedInChanged', true);
                }).error(function (data, status) {
                    $scope.invalidCredentials = true;
                    $scope.$emit('loggedInChanged', false);
                    // $rootScope.isLoggedIn = true;
                    console.log(data);
                });

        }


    });