angular.module('rwsprojectApp')
  .controller('fixtureFormController', ['$scope', '$filter', '$rootScope', 'dataService',
    function ($scope, $filter, $rootScope, dataService) {

      $scope.sensorTypeDisabled = true;

      $rootScope.resetConfirmEnabled = false;

      $scope.sensorTypeToAccessoryPart = {
        "Normal": "RS-2G",
        "Low": "RS-2G-LS",
        "High": "RS-2G-HS"
      };

      $rootScope.fixtureForm = {};
      $rootScope.fixtureForm.dropDownChoices = {};

      $scope.setFixtureTypesBySelectedRegion = function () {
        $rootScope.fixtureForm.dropDownChoices = $rootScope.fixtureForm.dropDownChoices == undefined ? {} : $rootScope.fixtureForm.dropDownChoices;
        $rootScope.fixtureForm.dropDownChoices.sensorTypes = [
          {name: 'Normal', id: 1},
          {name: 'Low', id: 2},
          {name: 'High', id: 3}
        ];

        dataService.fetchFixtureTypes($rootScope.tabs.tabOne.region.id)
          .success(function (types) {
            $rootScope.fixtureForm.dropDownChoices.fixtureTypes = types.payload;
          })
          .error(function (er) {
            console.log(er);
          });
      };


      $scope.setSensorTwoTypes = function () {
        $rootScope.fixtureForm.dropDownChoices = $rootScope.fixtureForm.dropDownChoices || {};
        $rootScope.fixtureForm.dropDownChoices.sensorTwoTypes = [
          {name: 'RS-2G', id: 1},
          {name: 'RS-2G-LS', id: 2},
          {name: 'RS-2G-HS', id: 3}
        ]
      };


      $rootScope.$on('entering2', function (stuff, fromTab, toTab) {
        $scope.setFixtureTypesBySelectedRegion();
        $scope.setSensorTwoTypes();

        $rootScope.fixtureForm = $rootScope.fixtureForm ? $rootScope.fixtureForm : {};
        // set some defaults
        $rootScope.fixtureForm.emergencyQuantity = $rootScope.fixtureForm.emergencyQuantity | 0;
        $rootScope.fixtureForm.sensorType = $rootScope.fixtureForm.sensorType | 2;
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

        dataService.fetchManufacturers($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id)
          .success(function (man) {
            $rootScope.fixtureForm.dropDownChoices.manufacturers = man.payload;

            // if there is only one, auto select it
            if (man.payload.length == 1) {
              $rootScope.fixtureForm.manufacturer = man.payload[0];
              $scope.changeManufacturers();
            }
          })
          .error(function (er) {
            console.log(er);
          });
      };

      $scope.changeMountType = function () {

        dataService.fetchFixtureSizes($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
          $rootScope.fixtureForm.manufacturer.id)
          .success(function (sizes) {
            $rootScope.fixtureForm.dropDownChoices.fixtureSizes = sizes.payload;

            // auto select
            if (sizes.payload.length == 1) {
              $rootScope.fixtureForm.fixtureSize = sizes.payload[0];
              $scope.changeFixtureSize();
            }
          })
          .error(function (er) {
            console.log(er);
          })
      };

      $scope.changeFixtureSize = function () {

        dataService.fetchDistributions($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id,
          $rootScope.fixtureForm.mountType.id, $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.manufacturer.id)
          .success(function (distributions) {
            $rootScope.fixtureForm.dropDownChoices.distributions = distributions.payload;

            // auto select
            if (distributions.payload.length == 1) {
              $rootScope.fixtureForm.distribution = distributions.payload[0];
              $scope.changeDistribution();
            }
          })
          .error(function (er) {
            console.log(er);
          })

      };


      $scope.changeDistribution = function () {

        dataService.fetchLumens($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
          $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.manufacturer.id)
          .success(function (lumens) {
            $rootScope.fixtureForm.dropDownChoices.lumens = lumens.payload;

            // auto select
            if (lumens.payload.length == 1) {
              $rootScope.fixtureForm.lumens = lumens.payload[0];
              $scope.changeLumens();
            }
          })
          .error(function (er) {
            console.log(er);
          })
      };


      $scope.changeLumens = function () {
        dataService.fetchChannels($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
          $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.manufacturer.id)
          .success(function (channels) {
            $rootScope.fixtureForm.dropDownChoices.channels = channels.payload;

            // auto select
            if (channels.payload.length == 1) {
              $rootScope.fixtureForm.channels = channels.payload[0];
              $scope.changeChannels();
            }
          })
          .error(function (er) {
            console.log(er);
          })

      };

      $scope.changeChannels = function () {
        dataService.fetchControlMethods($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.mountType.id,
          $rootScope.fixtureForm.fixtureSize.id, $rootScope.fixtureForm.distribution.id, $rootScope.fixtureForm.lumens.id, $rootScope.fixtureForm.channels.id,
          $rootScope.fixtureForm.manufacturer.id)
          .success(function (methods) {
            $rootScope.fixtureForm.dropDownChoices.controlMethods = methods.payload;

            // auto select
            if (methods.payload.length == 1) {
              $rootScope.fixtureForm.controlMethod = methods.payload[0];
              $scope.changeControlMethod();
            }
          })
          .error(function (er) {
            console.log(er);
          })
      };

      $scope.changeManufacturers = function () {
        dataService.fetchMountTypes($rootScope.tabs.tabOne.region.id, $rootScope.fixtureForm.fixtureType.id, $rootScope.fixtureForm.manufacturer.id)
          .success(function (mounts) {
            $rootScope.fixtureForm.dropDownChoices.mountTypes = mounts.payload;

            // auto select
            if (mounts.payload.length == 1) {
              $rootScope.fixtureForm.mountType = mounts.payload[0];
              $scope.changeMountType();
            }
          })
          .error(function (er) {
            console.log(er);
          })
      };


      $scope.changeControlMethod = function () {
        console.log('changed to ' , $rootScope.fixtureForm.controlMethod);

        if ($rootScope.fixtureForm.controlMethod.name.toLowerCase() == 'integrated' ||
          $rootScope.fixtureForm.controlMethod.name.toLowerCase() == 'n/a') {
          $rootScope.controlQtyRequired = false;
        } else {
          $rootScope.controlQtyRequired = true;
        }

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

        // EXCEPTION: 8' birchwood exception for LED Gateway (where they have to choose an additional sensor type)
        if ( ($scope.fixtureForm.sensorType || {}).name ) {
          var part = $scope.sensorTypeToAccessoryPart[$scope.fixtureForm.sensorType.name];
          $rootScope.accessoryTally[part] = $rootScope.accessoryTally[part] || 0;

          $rootScope.accessoryTally[part] += parseInt($scope.fixtureForm.controlQuantity);
        }


        // EXCEPTION: downlight-shared exception, where we need to add 1 splitter * control quantity in accessories
        if ($scope.fixtureForm.fixtureType.name.toLowerCase() == 'downlight-shared') {
          var splitterPart = '760164233';
          $rootScope.accessoryTally[splitterPart] = $rootScope.accessoryTally[splitterPart] || 0;
          $rootScope.accessoryTally[splitterPart] += parseInt($scope.fixtureForm.controlQuantity || 1);
        }

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

      $scope.resetFixtureFormPrompt = function () {
        if ($scope.fixtureTabForm.$dirty) {
          $rootScope.resetConfirmEnabled = true;
        } else {
          $scope.resetFixtureForm();
        }
      };

      $rootScope.resetConfirmCancel = function () {
        $rootScope.resetConfirmEnabled = false;
      };

      $rootScope.resetFixtureForm = function () {
        $rootScope.resetConfirmEnabled = false;
        $rootScope.fixtureForm = {};
        $rootScope.fixtureForm.emergencyQuantity = 0;
        $scope.setFixtureTypesBySelectedRegion();
        $scope.setSensorTwoTypes();
        dataService.fixNotes = '';
        $scope.fixtureTabForm.$setPristine(true);
        dataService.selectedFixtureLine = undefined;
        $rootScope.selectedAccessories = [];
        $rootScope.accessoryTally = {};
      };

      $scope.hasLineBeenAdded = function () {
        return $scope.fixtureForm.fixtureLineId != undefined;
      };

      $scope.$watch('fixtureForm.controlMethod', function (newVal, oldVal) {
        if ($rootScope.fixtureForm.controlMethod) {
          $scope.sensorTypeDisabled = newVal.name.toLowerCase().indexOf('gateway') == -1;
        }
      });


      // watch the form for certain fixture configurations to show up
      $scope.$watch('fixtureForm.controlMethod', function (newVal, oldVal) {
        // EXCEPTION 1. if they choose an 8' birchwood fixture, Sensor 3, we need to enable the sensor select list
        if (
          $scope.fixtureForm.fixtureType && $scope.fixtureForm.fixtureType.name.toLowerCase() === 'linear' &&
          $scope.fixtureForm.fixtureSize && $scope.fixtureForm.fixtureSize.name === "8'" &&
          $scope.fixtureForm.manufacturer && $scope.fixtureForm.manufacturer.name.toLowerCase() === 'birchwood' &&
          $scope.fixtureForm.controlMethod && $scope.fixtureForm.controlMethod.name.toLowerCase() === 'led gateway'
        ) {
          $scope.eightFootBirchwoodSelected = true;
        } else {
          $scope.eightFootBirchwoodSelected = false;
        }

      });

    }]);
