angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $route, $http) {

        // this is really our main controller, so whenever this guy runs, let's check to
        // see if we're logged in or not
        $http.get('/server/checkAccess')
            .success(function () {
                console.log('we are logged in');
                $scope.isLoggedIn = true;
            })
            .error(function () {
                console.log('we are not logged in');
                $scope.isLoggedIn = true;
            });

        $scope.isLoggedIn = true;
        $scope.invalidCredentials = false;

        $scope.tabs = {};
        $scope.user = {};
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


        $scope.tempToggleLogin = function () {
            $scope.isLoggedIn = !$scope.isLoggedIn;
        };

        $scope.doLogin = function () {
            var loginData = {
                username: $scope.user.name,
                password: $scope.user.password
            };

            $http({method: 'POST', url: '/server/login', data: loginData})
                .success(function (data, status) {
                    $scope.isLoggedIn = true;
                    $scope.invalidCredentials = false;
                }).error(function (data, status) {
                    $scope.invalidCredentials = true;
                    console.log(data);
                });

        }

    });