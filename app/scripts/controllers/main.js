'use strict';

/**
 * @ngdoc function
 * @name rwsprojectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rwsprojectApp
 */
angular.module('rwsprojectApp')
  .controller('MainCtrl', ['$scope', '$http', '$rootScope', 'dataService', '$window', '$location',
    function ($scope, $http, $rootScope, dataService, $window, $location) {

      $rootScope.parseInt = parseInt;

      $rootScope.print = function () {
        $window.print();
      };

      $rootScope.back = function () {
        $window.history.back();
      };

      $rootScope.disclaimer = "\
      These calculation/configuration/design tools are provided for guidance purposes only “as is” and should not be used or in any way relied upon without\
      consultation with and supervision of experienced personnel and a local CommScope representative. CommScope makes no representations or warranties of any\
      kind, express or implied, and specifically disclaims and excludes any representation or warranty of merchantability, quality, content, completeness,\
        suitability, adequacy, accuracy, noninfringement or fitness for a particular purpose and any representation arising by usage of trade, course of dealing\
      or course of performance. CommScope is under no obligation to issue any upgrades, update specifications or notify users of this tool that changes have\
      been made. The user of these tools assumes all risks associated with such use, and CommScope hereby disclaims any and all liability for damages of any\
      kind resulting from such use.";

      console.log('main controller is being instantiated, id ' + $scope.id);

      $scope.user = {};
      $rootScope.authenticatedUser = {};
      $rootScope.isLoggedIn = undefined;

      $rootScope.dataService = dataService;

      dataService.checkAccess()
        .success(function (data) {
          $rootScope.isLoggedIn = true;
          $rootScope.authenticatedUser.username = data.username;
          $rootScope.authenticatedUser.role = data.role;
          $scope.$emit('loggedInChanged', true);
        })
        .error(function () {
          $rootScope.authenticatedUser = {};
          $rootScope.isLoggedIn = false;
          $scope.$emit('loggedInChanged', false);
        });

      $scope.doLogin = function () {
        dataService.doLogin($scope.user.name, $scope.user.password)
          .success(function (data, status) {
            $rootScope.isLoggedIn = true;
            $rootScope.authenticatedUser.username = data.username;
            $rootScope.authenticatedUser.role = data.role;
            $scope.invalidCredentials = false;
            $scope.$emit('loggedInChanged', true);
          }).error(function (data, status) {
            $scope.invalidCredentials = true;
            $rootScope.authenticatedUser = {};
            $scope.$emit('loggedInChanged', false);
          });

      };

      $scope.signoff = function () {
        console.log('signing off');
        dataService.signoff();
      };

      $rootScope.errorMessage = undefined;

      $rootScope.$on('error', function (event, errorMessage) {
        console.log('RS received event ' + event + ' error ' + errorMessage);

        $rootScope.errorMessage = errorMessage;
      });

      $rootScope.logit = function (stuff) {
        console.log(stuff);
      };

      $rootScope.dismissError = function () {
        $rootScope.errorMessage = undefined;
      };

      $rootScope.go = function (loc) {
        $location.path(loc);
      }

    }]);
