angular.module('rwsprojectApp')
    .controller('enginesController', ['$scope', '$filter', '$rootScope', 'dataService', '$httpBackend',
        function ($scope, $filter, $rootScope, dataService, $httpBackend) {


            var channelsPerEngine = 47;
            var enginesPerDirector = 41;

            var cordOptions277 = [
                'Included'
            ];

            var cordOptions250 = [
                'US/Canada PC-NA-250',
                'European Union PC-EU-120-250',
                'UK, Hong Kong, Singapore PC-UK-120-250',
                'Australia / New Zealand PC-AUS-120-250',
                'Brazil PC-BRAZIL',
                'China PC-CHINA',
                'Denmark PC-DENMARK',
                'Switzerland PC-SWISS',
                'Excluded'
            ];

            $scope.disableStandardCord = false;
            $scope.disableEmergencyCord = false;

            $rootScope.$on('entering4', function (event, fromTab, toTab) {

                $scope.$watch('engineModel.voltageStandard', function(newVal, oldVal) {
                    if(newVal == '277v') {
                        $scope.disableStandardCord = true;
                        $scope.cordOptions = cordOptions277;
                        $scope.engineModel.cordStandard = 'Included'
                    } else {
                        $scope.disableStandardCord = false;
                        $scope.cordOptions = cordOptions250;
                    }
                });

                $scope.$watch('engineModel.voltageEmergency', function(newVal, oldVal) {
                    if(newVal == '277v') {
                        $scope.disableEmergencyCord = true;
                        $scope.cordOptions = cordOptions277;
                        $scope.engineModel.cordEmergency = 'Included'
                    } else {
                        $scope.disableEmergencyCord = false;
                        $scope.cordOptions = cordOptions250;
                    }
                });

                $scope.engineModel = $scope.engineModel ? $scope.engineModel : {};

                $scope.standardChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                    return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.standardQuantity);
                }, 0);

                $scope.emergencyChannels = _.reduce(dataService.fixtureLines, function (initial, fixtureRec) {
                    return initial + fixtureRec.channels.channel_count * parseInt(fixtureRec.emergencyQuantity);
                }, 0);

                $scope.standardEngines = Math.ceil($scope.standardChannels / channelsPerEngine);
                $scope.emergencyEngines = Math.ceil($scope.emergencyChannels / channelsPerEngine);
                $scope.engineModel.directorCount = Math.ceil(($scope.standardEngines + $scope.emergencyEngines) / enginesPerDirector);

                $scope.engineModel = $scope.engineModel ? $scope.engineModel : {};

                // defaults
                $scope.engineModel.platesStandard = $scope.engineModel.platesStandard | 0;
                $scope.engineModel.platesEmergency = $scope.engineModel.platesEmergency | 0;
                $scope.engineModel.enginesStandard = $scope.engineModel.enginesStandard | 0;
                $scope.engineModel.enginesEmergency = $scope.engineModel.enginesEmergency | 0;
                $scope.engineModel.directorCount = $scope.engineModel.directorCount | 0;
            });


            $rootScope.$on('leaving4', function (event, fromTab, toTab) {
                event.stopPropagation();

                if (parseInt(toTab) < 4) {
                    $rootScope.tabs.activeTab = toTab;
                } else {
                    // TRYING TO LEAVE THE FORM
                    if ($scope.enginesForm.$valid) {
                        dataService.engineModel = $scope.engineModel;
                        $rootScope.tabs.activeTab = toTab;
                    } else {
                        $scope.enginesForm.$setSubmitted();
                    }
                }

            });


        }]);