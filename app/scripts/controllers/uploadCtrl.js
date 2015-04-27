angular.module('rwsprojectApp')
  .controller('uploadCtrl', ['$scope', 'FileUploader', 'dataService', '$route', '$rootScope',
    function ($scope, FileUploader, dataService, $route, $rootScope) {

      $scope.importResultsMock = {
        "errors": [
          /*
          {
            "csvError": "Error on row 11",
            "exception": "",
            "row": {
              "": null,
              "# of Channels": null,
              "Control Method": null,
              "Control Qty Multiplier": null,
              "Country": "asdfasdf",
              "Description (MFG, Length, Series, Mount Type)": null,
              "Distribution": null,
              "Fixture Type": "asdf",
              "LED Gateway/Sensor Part#": null,
              "Lumens": null,
              "MFG": null,
              "Model Number": null,
              "Mounting Type": "asdf",
              "PID": null,
              "Size": ""
            },
            "stack": "Traceback (most recent call last):\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 291, in DoImport\n    multID = queryForId(query, cur)\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 25, in queryForId\n    cursor.execute(query)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/cursors.py\", line 205, in execute\n    self.errorhandler(self, exc, value)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/connections.py\", line 36, in defaulterrorhandler\n    raise errorclass, errorvalue\nOperationalError: (1054, \"Unknown column 'n' in 'where clause'\")\n"
          },
          {
            "csvError": "Error on row 13",
            "exception": "",
            "row": {
              "": null,
              "# of Channels": null,
              "Control Method": null,
              "Control Qty Multiplier": null,
              "Country": "123",
              "Description (MFG, Length, Series, Mount Type)": null,
              "Distribution": "123",
              "Fixture Type": "123",
              "LED Gateway/Sensor Part#": null,
              "Lumens": "$$$$$",
              "MFG": null,
              "Model Number": null,
              "Mounting Type": "123",
              "PID": null,
              "Size": "123"
            },
            "stack": "Traceback (most recent call last):\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 291, in DoImport\n    multID = queryForId(query, cur)\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 25, in queryForId\n    cursor.execute(query)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/cursors.py\", line 205, in execute\n    self.errorhandler(self, exc, value)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/connections.py\", line 36, in defaulterrorhandler\n    raise errorclass, errorvalue\nOperationalError: (1054, \"Unknown column 'n' in 'where clause'\")\n"
          },
          {
            "csvError": "Error on row 15",
            "exception": "",
            "row": {
              "null": [
                "dfs",
                "dfsd",
                ""
              ],
              "": "dfs",
              "# of Channels": "sdf",
              "Control Method": "sdf",
              "Control Qty Multiplier": "sdf",
              "Country": "sdf",
              "Description (MFG, Length, Series, Mount Type)": "sdf",
              "Distribution": "",
              "Fixture Type": "sdf",
              "LED Gateway/Sensor Part#": "sdf",
              "Lumens": "sdf",
              "MFG": "sdf",
              "Model Number": "sdf",
              "Mounting Type": "sdf",
              "PID": "sdf",
              "Size": "sdf"
            },
            "stack": "Traceback (most recent call last):\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 291, in DoImport\n    multID = queryForId(query, cur)\n  File \"/opt/projects/redwood/rwsproject/server/src/FixtureImporter.py\", line 25, in queryForId\n    cursor.execute(query)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/cursors.py\", line 205, in execute\n    self.errorhandler(self, exc, value)\n  File \"build/bdist.macosx-10.9-intel/egg/MySQLdb/connections.py\", line 36, in defaulterrorhandler\n    raise errorclass, errorvalue\nOperationalError: (1054, \"Unknown column 'sdf' in 'where clause'\")\n"
          }
          */
        ],
        "insertedCount": 419,
        "warnings": [
          "Missing part number on line 28",
          "Missing part number on line 29",
          "Missing part number on line 30",
          "Missing part number on line 31",
          "Missing part number on line 32",
          "Missing part number on line 33",
          "Missing part number on line 34",
          "Missing part number on line 38",
          "Missing part number on line 39",
          "Missing part number on line 40",
          "Missing part number on line 41",
          "Missing part number on line 42",
          "Missing part number on line 43",
          "Missing part number on line 44",
          "Missing part number on line 45",
          "Missing part number on line 46",
          "Missing part number on line 47",
          "Missing part number on line 48",
          "Missing part number on line 49",
          "Missing part number on line 80",
          "Missing part number on line 81",
          "Missing part number on line 82",
          "Missing part number on line 83",
          "Missing part number on line 84",
          "Missing part number on line 85",
          "Missing part number on line 86",
          "Missing part number on line 87",
          "Missing part number on line 88",
          "Missing part number on line 89",
          "Missing part number on line 90",
          "Missing part number on line 91",
          "Missing part number on line 111",
          "Missing part number on line 112",
          "Missing part number on line 117",
          "Missing part number on line 131",
          "Missing part number on line 132",
          "Missing part number on line 133",
          "Missing part number on line 138",
          "Missing part number on line 178",
          "Missing part number on line 181",
          "Missing part number on line 184",
          "Missing pid on line 184",
          "Missing part number on line 206",
          "Missing part number on line 207",
          "Missing part number on line 208",
          "Missing part number on line 209",
          "Missing part number on line 210",
          "Missing part number on line 211",
          "Missing part number on line 212",
          "Missing part number on line 213",
          "Missing part number on line 214",
          "Missing part number on line 215",
          "Missing part number on line 216",
          "Missing part number on line 217",
          "Missing part number on line 218",
          "Missing part number on line 219",
          "Missing part number on line 220",
          "Missing part number on line 221",
          "Missing part number on line 222",
          "Missing part number on line 223",
          "Missing part number on line 224",
          "Missing part number on line 225",
          "Missing part number on line 226",
          "Missing part number on line 227",
          "Missing part number on line 228",
          "Missing part number on line 229",
          "Missing part number on line 232",
          "Missing part number on line 233",
          "Missing part number on line 238",
          "Missing part number on line 240",
          "Missing part number on line 246",
          "Missing part number on line 247",
          "Missing part number on line 286",
          "Missing part number on line 307",
          "Missing part number on line 308",
          "Missing part number on line 371",
          "Missing part number on line 372",
          "Missing part number on line 374",
          "Missing part number on line 375",
          "Missing part number on line 382",
          "Missing part number on line 383",
          "Missing part number on line 384",
          "Missing part number on line 385",
          "Missing mount option on line 386",
          "Missing fixture size on line 386",
          "Missing light distribution on line 386",
          "Missing manufacturer on line 386",
          "Missing lumens on line 386",
          "Missing mount option on line 387",
          "Missing fixture size on line 387",
          "Missing light distribution on line 387",
          "Missing manufacturer on line 387",
          "Missing lumens on line 387",
          "Missing control method on line 387",
          "Missing part number on line 387",
          "Missing pid on line 387",
          "Missing mount option on line 388",
          "Missing fixture size on line 388",
          "Missing light distribution on line 388",
          "Missing manufacturer on line 388",
          "Missing lumens on line 388",
          "Missing mount option on line 389",
          "Missing fixture size on line 389",
          "Missing light distribution on line 389",
          "Missing manufacturer on line 389",
          "Missing lumens on line 389",
          "Missing pid on line 389",
          "Missing lumens on line 390",
          "Missing mount option on line 391",
          "Missing fixture size on line 391",
          "Missing light distribution on line 391",
          "Missing manufacturer on line 391",
          "Missing lumens on line 391",
          "Missing mount option on line 392",
          "Missing fixture size on line 392",
          "Missing light distribution on line 392",
          "Missing manufacturer on line 392",
          "Missing lumens on line 392",
          "Missing control method on line 392",
          "Missing part number on line 392",
          "Missing pid on line 392",
          "Missing mount option on line 393",
          "Missing fixture size on line 393",
          "Missing light distribution on line 393",
          "Missing manufacturer on line 393",
          "Missing lumens on line 393",
          "Missing mount option on line 394",
          "Missing fixture size on line 394",
          "Missing light distribution on line 394",
          "Missing manufacturer on line 394",
          "Missing lumens on line 394",
          "Missing pid on line 394",
          "Missing lumens on line 395",
          "Missing mount option on line 396",
          "Missing fixture size on line 396",
          "Missing light distribution on line 396",
          "Missing manufacturer on line 396",
          "Missing lumens on line 396",
          "Missing mount option on line 397",
          "Missing fixture size on line 397",
          "Missing light distribution on line 397",
          "Missing manufacturer on line 397",
          "Missing lumens on line 397",
          "Missing control method on line 397",
          "Missing part number on line 397",
          "Missing pid on line 397",
          "Missing mount option on line 398",
          "Missing fixture size on line 398",
          "Missing light distribution on line 398",
          "Missing manufacturer on line 398",
          "Missing lumens on line 398",
          "Missing mount option on line 399",
          "Missing fixture size on line 399",
          "Missing light distribution on line 399",
          "Missing manufacturer on line 399",
          "Missing lumens on line 399",
          "Missing pid on line 399",
          "Missing lumens on line 400",
          "Missing mount option on line 401",
          "Missing fixture size on line 401",
          "Missing light distribution on line 401",
          "Missing manufacturer on line 401",
          "Missing lumens on line 401",
          "Missing mount option on line 402",
          "Missing fixture size on line 402",
          "Missing light distribution on line 402",
          "Missing manufacturer on line 402",
          "Missing lumens on line 402",
          "Missing control method on line 402",
          "Missing part number on line 402",
          "Missing pid on line 402",
          "Missing mount option on line 403",
          "Missing fixture size on line 403",
          "Missing light distribution on line 403",
          "Missing manufacturer on line 403",
          "Missing lumens on line 403",
          "Missing mount option on line 404",
          "Missing fixture size on line 404",
          "Missing light distribution on line 404",
          "Missing manufacturer on line 404",
          "Missing lumens on line 404",
          "Missing pid on line 404",
          "Missing lumens on line 405",
          "Missing mount option on line 406",
          "Missing fixture size on line 406",
          "Missing light distribution on line 406",
          "Missing manufacturer on line 406",
          "Missing lumens on line 406",
          "Missing mount option on line 407",
          "Missing fixture size on line 407",
          "Missing light distribution on line 407",
          "Missing manufacturer on line 407",
          "Missing lumens on line 407",
          "Missing control method on line 407",
          "Missing part number on line 407",
          "Missing pid on line 407",
          "Missing mount option on line 408",
          "Missing fixture size on line 408",
          "Missing light distribution on line 408",
          "Missing manufacturer on line 408",
          "Missing lumens on line 408",
          "Missing mount option on line 409",
          "Missing fixture size on line 409",
          "Missing light distribution on line 409",
          "Missing manufacturer on line 409",
          "Missing lumens on line 409",
          "Missing pid on line 409",
          "Missing lumens on line 410",
          "Missing mount option on line 411",
          "Missing fixture size on line 411",
          "Missing light distribution on line 411",
          "Missing manufacturer on line 411",
          "Missing lumens on line 411",
          "Missing mount option on line 412",
          "Missing fixture size on line 412",
          "Missing light distribution on line 412",
          "Missing manufacturer on line 412",
          "Missing lumens on line 412",
          "Missing control method on line 412",
          "Missing part number on line 412",
          "Missing pid on line 412",
          "Missing mount option on line 413",
          "Missing fixture size on line 413",
          "Missing light distribution on line 413",
          "Missing manufacturer on line 413",
          "Missing lumens on line 413",
          "Missing mount option on line 414",
          "Missing fixture size on line 414",
          "Missing light distribution on line 414",
          "Missing manufacturer on line 414",
          "Missing lumens on line 414",
          "Missing pid on line 414",
          "Missing lumens on line 415",
          "Missing mount option on line 416",
          "Missing fixture size on line 416",
          "Missing light distribution on line 416",
          "Missing manufacturer on line 416",
          "Missing lumens on line 416",
          "Missing mount option on line 417",
          "Missing fixture size on line 417",
          "Missing light distribution on line 417",
          "Missing manufacturer on line 417",
          "Missing lumens on line 417",
          "Missing control method on line 417",
          "Missing part number on line 417",
          "Missing pid on line 417",
          "Missing mount option on line 418",
          "Missing fixture size on line 418",
          "Missing light distribution on line 418",
          "Missing manufacturer on line 418",
          "Missing lumens on line 418",
          "Missing mount option on line 419",
          "Missing fixture size on line 419",
          "Missing light distribution on line 419",
          "Missing manufacturer on line 419",
          "Missing lumens on line 419",
          "Missing pid on line 419",
          "Missing lumens on line 420",
          "Missing mount option on line 421",
          "Missing fixture size on line 421",
          "Missing light distribution on line 421",
          "Missing manufacturer on line 421",
          "Missing lumens on line 421",
          "Missing mount option on line 422",
          "Missing fixture size on line 422",
          "Missing light distribution on line 422",
          "Missing manufacturer on line 422",
          "Missing lumens on line 422",
          "Missing control method on line 422",
          "Missing part number on line 422",
          "Missing pid on line 422",
          "Missing mount option on line 423",
          "Missing fixture size on line 423",
          "Missing light distribution on line 423",
          "Missing manufacturer on line 423",
          "Missing lumens on line 423",
          "Missing mount option on line 424",
          "Missing fixture size on line 424",
          "Missing light distribution on line 424",
          "Missing manufacturer on line 424",
          "Missing lumens on line 424",
          "Missing pid on line 424",
          "Missing lumens on line 425"
        ]
      };

      $scope.uploader = new FileUploader();
      $scope.baseUploadURL = '/server/uploadFixtureData';
      $scope.uploader.url = $scope.baseUploadURL;
      $scope.uploader.removeAfterUpload = true;

      $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.importAttempted = true;
        $scope.importResults = response.importResults
      };

      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        $scope.importAttempted = true;
        $scope.importResults = response.importResults
      };

      $scope.swapFixtureDB = function () {
        dataService.swapFixtureDB()
          .success(function () {
            $scope.swapSucceeded = true;
          })
          .error(function (data, status) {
            $scope.swapSucceeded = false;
            $scope.swapResult = data.result;
          })
      }


    }]);
