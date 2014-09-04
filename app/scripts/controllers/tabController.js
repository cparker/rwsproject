angular.module('rwsprojectApp')
    .controller('tabController', function ($scope, $rootScope, $route, $http) {

        $rootScope.thing = "HAHAHA";

        $rootScope.isLoggedIn = undefined;

        $scope.invalidCredentials = false;

        $scope.tabs = {};
        $scope.user = {};
        $scope.tabs.activeTab = 'tab6';
        $scope.selectedLineId = undefined;

        $scope.fixtureLines = [];

        $scope.tabs.accessoriesDialogHide = true;
        $scope.tabs.notesDialogHide = true;

        $scope.addFixtureLine = function() {
            var nextId = undefined;
            if ($scope.fixtureLines.length > 0) {
                nextId = $scope.fixtureLines[$scope.fixtureLines.length-1] + 1;
            } else {
                nextId = 1;
            }
            $scope.fixtureLines.push(nextId);
        };

        $scope.deleteFixtureLine = function(lineId) {
            var index = $scope.fixtureLines.indexOf(lineId);
            $scope.fixtureLines.splice(index,1);
        };

        $scope.fixtureLineSelect = function (lineId) {
            $scope.selectedLineId = lineId;
        };

        $scope.isLineSelected = function (lineId) {
            return lineId == $scope.selectedLineId;
        };

        $scope.tabs.tabClick = function (tabId, $event) {
            $scope.tabs.activeTab = tabId;
        };

        $scope.tabs.isTabActive = function (tabId) {
            return tabId == $scope.tabs.activeTab;
        };

        $scope.tabs.toggleAccessoriesDialog = function () {
            $scope.tabs.accessoriesDialogHide =
                $scope.tabs.accessoriesDialogHide == false;
        };

        $scope.tabs.toggleNotesDialog = function () {
            $scope.tabs.notesDialogHide =
                $scope.tabs.notesDialogHide == false;
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