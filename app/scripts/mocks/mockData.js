var rwsMockEnabled = false;

var mockProjectInfo = {
  "address": "123 Elm St.",
  "basedOn": "Diagram",
  "createdBy": "CP",
  "dateTime": "2014-11-17 02:33:23 PM",
  "email": "cp@cjparker.us",
  "notes": "These are the project notes",
  "projectName": "Project Awesome",
  "region": {
    "id": 2,
    "name": "EMEA"
  },
  "region_id": 2
};

var mockRegions = {
  "payload": [
    {
      "id": 1,
      "name": "APAC"
    },
    {
      "id": 2,
      "name": "EMEA"
    },
    {
      "id": 3,
      "name": "CALA"
    },
    {
      "id": 4,
      "name": "NAR"
    },
    {
      "id": 5,
      "name": "Asia Pacific"
    },
    {
      "id": 6,
      "name": "Europe"
    },
    {
      "id": 7,
      "name": "USA/Canada"
    }
  ]
};

var mockFixtureTypes = {
  "payload": [
    {
      "id": 8,
      "name": "AC Zones (Qty)"
    },
    {
      "id": 1,
      "name": "Accent"
    },
    {
      "id": 7,
      "name": "Desk Sensor"
    },
    {
      "id": 2,
      "name": "Downlight"
    },
    {
      "id": 5,
      "name": "Fixtureless"
    },
    {
      "id": 4,
      "name": "Linear"
    },
    {
      "id": 6,
      "name": "Occupancy"
    },
    {
      "id": 10,
      "name": "Out of Scope"
    },
    {
      "id": 3,
      "name": "Troffer"
    }
  ]
};

var mockAccessories = {
  "payload": [
    {
      "description": "Universal Gateway Wiring Harness",
      "part_number": "RG-2G-WH"
    },
    {
      "description": "RIB Relay -  10 Amp SPDT, 120-277Vac",
      "part_number": "PER-RIB21CDC"
    },
    {
      "description": "Downlight Splitter (DL12A)",
      "part_number": "760164233"
    },
    {
      "description": "Cable Sharing Splitter - SP12A (2 per horizontal run)",
      "part_number": "760191841"
    },
    {
      "description": "Sensor mounting box (open ceiling)",
      "part_number": "ADAPTER-BOX-1G"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2",
      "part_number": "ADP-MOUNT-W"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2 (20pk)",
      "part_number": "ADP-MOUNT-W-20"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2 (50pk)",
      "part_number": "ADP-MOUNT-W-50"
    },
    {
      "description": "RJ45-18AWG Adapter (1 per CH)",
      "part_number": "TRM-RJ45-EU"
    },
    {
      "description": "10 pin to RJ45 fixture adapter",
      "part_number": "CAB-10PIN-RJ45"
    },
    {
      "description": "3-1 Wire Harness(3 fixtures: 1 LED gateway)",
      "part_number": "HARNESS-3-FIXTURE"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 2\" length",
      "part_number": "CABEXT-2"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 4\" length",
      "part_number": "CABEXT-4"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 6\" length",
      "part_number": "CABEXT-6"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 8\" length",
      "part_number": "CABEXT-8"
    },
    {
      "description": "1ch fixt-adp pigtail, 36 inch length",
      "part_number": "PIGTAIL-1-FIXTURE"
    },
    {
      "description": "2ch fixt-adp pigtail, 36 inch length",
      "part_number": "PIGTAIL-2-FIXTURE"
    }
  ]
};

var mockFixtureLines = [
  {
    "$$hashKey": "object:90",
    "channels": {
      "channel_count": 1,
      "id": 3
    },
    "controlMethod": {
      "id": 2,
      "name": "LED Gateway + Sensor 2"
    },
    "controlQuantity": "1",
    "distribution": {
      "id": 3,
      "name": "Direct"
    },
    "dropDownChoices": {
      "channels": [
        {
          "channel_count": 1,
          "id": 3
        }
      ],
      "controlMethods": [
        {
          "id": 2,
          "name": "LED Gateway + Sensor 2"
        }
      ],
      "distributions": [
        {
          "id": 3,
          "name": "Direct"
        }
      ],
      "fixtureSizes": [
        {
          "id": 11,
          "name": "2x2"
        },
        {
          "id": 12,
          "name": "2x4"
        },
        {
          "id": 7,
          "name": "1x4"
        }
      ],
      "fixtureTypes": [
        {
          "id": 8,
          "name": "AC Zones (Qty)"
        },
        {
          "id": 1,
          "name": "Accent"
        },
        {
          "id": 7,
          "name": "Desk Sensor"
        },
        {
          "id": 2,
          "name": "Downlight"
        },
        {
          "id": 5,
          "name": "Fixtureless"
        },
        {
          "id": 4,
          "name": "Linear"
        },
        {
          "id": 6,
          "name": "Occupancy"
        },
        {
          "id": 10,
          "name": "Out of Scope"
        },
        {
          "id": 3,
          "name": "Troffer"
        }
      ],
      "lumens": [
        {
          "id": 14,
          "lumens": "3000"
        },
        {
          "id": 15,
          "lumens": "3050"
        },
        {
          "id": 19,
          "lumens": "3545"
        },
        {
          "id": 18,
          "lumens": "3400"
        },
        {
          "id": 23,
          "lumens": "3761"
        }
      ],
      "manufacturers": [
        {
          "id": 13,
          "name": "SPM"
        }
      ],
      "mountTypes": [
        {
          "id": 6,
          "name": "Recessed"
        },
        {
          "id": 3,
          "name": "Surface"
        },
        {
          "id": 1,
          "name": "Suspended"
        }
      ],
      "sensorTypes": [
        {
          "id": 1,
          "name": "None"
        },
        {
          "id": 2,
          "name": "Normal"
        },
        {
          "id": 3,
          "name": "Low"
        },
        {
          "id": 4,
          "name": "High"
        }
      ]
    },
    "emergencyQuantity": "5",
    "fixtureId": "L4",
    "fixtureLineId": 3,
    "fixtureSize": {
      "id": 11,
      "name": "2x2"
    },
    "fixtureType": {
      "id": 3,
      "name": "Troffer"
    },
    "lumens": {
      "id": 23,
      "lumens": "3761"
    },
    "manufacturer": {
      "id": 13,
      "name": "SPM"
    },
    "mountType": {
      "id": 6,
      "name": "Recessed"
    },
    "notes": "L4 notes",
    "partInfo": {
      "desc_id": 3,
      "description": "2x2 Grid Lay in",
      "model": "SPM22DRWSxxxxx1YY",
      "model_id": 62,
      "part_id": 19,
      "part_number": "RG-2G-LED-SP221700RS-2G-01PIGTAIL-1-FIXTURE"
    },
    "projectId": "2014-11-17 02:33:23 PM",
    "selectedAccessories": [
      {
        "$$hashKey": "object:94",
        "accessory": {
          "description": "1ch fixt-adp pigtail, 36 inch length",
          "part_number": "PIGTAIL-1-FIXTURE"
        },
        "accessoryCount": 2
      }
    ],
    "sensorType": {
      "id": 3,
      "name": "Low"
    },
    "standardQuantity": "10"
  },
  {
    "$$hashKey": "object:84",
    "channels": {
      "channel_count": 1,
      "id": 3
    },
    "controlMethod": {
      "id": 1,
      "name": "Integrated"
    },
    "controlQuantity": "1",
    "distribution": {
      "id": 3,
      "name": "Direct"
    },
    "dropDownChoices": {
      "channels": [
        {
          "channel_count": 1,
          "id": 3
        }
      ],
      "controlMethods": [
        {
          "id": 1,
          "name": "Integrated"
        }
      ],
      "distributions": [
        {
          "id": 3,
          "name": "Direct"
        }
      ],
      "fixtureSizes": [
        {
          "id": 15,
          "name": "4'"
        },
        {
          "id": 24,
          "name": "8'"
        },
        {
          "id": 26,
          "name": "CUSTOM"
        }
      ],
      "fixtureTypes": [
        {
          "id": 8,
          "name": "AC Zones (Qty)"
        },
        {
          "id": 1,
          "name": "Accent"
        },
        {
          "id": 7,
          "name": "Desk Sensor"
        },
        {
          "id": 2,
          "name": "Downlight"
        },
        {
          "id": 5,
          "name": "Fixtureless"
        },
        {
          "id": 4,
          "name": "Linear"
        },
        {
          "id": 6,
          "name": "Occupancy"
        },
        {
          "id": 10,
          "name": "Out of Scope"
        },
        {
          "id": 3,
          "name": "Troffer"
        }
      ],
      "lumens": [
        {
          "id": 8,
          "lumens": "2300"
        },
        {
          "id": 14,
          "lumens": "3000"
        },
        {
          "id": 7,
          "lumens": "2000"
        }
      ],
      "manufacturers": [
        {
          "id": 9,
          "name": "Maxlite"
        }
      ],
      "mountTypes": [
        {
          "id": 6,
          "name": "Recessed"
        },
        {
          "id": 3,
          "name": "Surface"
        },
        {
          "id": 1,
          "name": "Suspended"
        },
        {
          "id": 2,
          "name": "Wall"
        }
      ],
      "sensorTypes": [
        {
          "id": 1,
          "name": "None"
        },
        {
          "id": 2,
          "name": "Normal"
        },
        {
          "id": 3,
          "name": "Low"
        },
        {
          "id": 4,
          "name": "High"
        }
      ]
    },
    "emergencyQuantity": "5",
    "fixtureId": "L3",
    "fixtureLineId": 2,
    "fixtureSize": {
      "id": 15,
      "name": "4'"
    },
    "fixtureType": {
      "id": 4,
      "name": "Linear"
    },
    "lumens": {
      "id": 14,
      "lumens": "3000"
    },
    "manufacturer": {
      "id": 9,
      "name": "Maxlite"
    },
    "mountType": {
      "id": 3,
      "name": "Surface"
    },
    "notes": "L3 fixture notes",
    "partInfo": {
      "desc_id": 46,
      "description": "L-Form Linear LED Fixture",
      "model": "LF48HDCB3341RW",
      "model_id": 26,
      "part_id": 44,
      "part_number": "n/a"
    },
    "projectId": "2014-11-17 02:33:23 PM",
    "selectedAccessories": [
      {
        "$$hashKey": "object:88",
        "accessory": {
          "description": "10Pin Fixt-to-GW cable extender, 8\" length",
          "part_number": "CABEXT-8"
        },
        "accessoryCount": 4
      }
    ],
    "sensorType": {},
    "standardQuantity": "10"
  },
  {
    "$$hashKey": "object:76",
    "channels": {
      "channel_count": 1,
      "id": 3
    },
    "controlMethod": {
      "id": 3,
      "name": "Sensor 3"
    },
    "controlQuantity": "1",
    "distribution": {
      "id": 3,
      "name": "Direct"
    },
    "dropDownChoices": {
      "channels": [
        {
          "channel_count": 1,
          "id": 3
        }
      ],
      "controlMethods": [
        {
          "id": 3,
          "name": "Sensor 3"
        }
      ],
      "distributions": [
        {
          "id": 3,
          "name": "Direct"
        }
      ],
      "fixtureSizes": [
        {
          "id": 5,
          "name": "19\""
        },
        {
          "id": 16,
          "name": "42.5\""
        }
      ],
      "fixtureTypes": [
        {
          "id": 8,
          "name": "AC Zones (Qty)"
        },
        {
          "id": 1,
          "name": "Accent"
        },
        {
          "id": 7,
          "name": "Desk Sensor"
        },
        {
          "id": 2,
          "name": "Downlight"
        },
        {
          "id": 5,
          "name": "Fixtureless"
        },
        {
          "id": 4,
          "name": "Linear"
        },
        {
          "id": 6,
          "name": "Occupancy"
        },
        {
          "id": 10,
          "name": "Out of Scope"
        },
        {
          "id": 3,
          "name": "Troffer"
        }
      ],
      "lumens": [
        {
          "id": 6,
          "lumens": "1870"
        }
      ],
      "manufacturers": [
        {
          "id": 8,
          "name": "MHT"
        }
      ],
      "mountTypes": [
        {
          "id": 5,
          "name": "Cord"
        },
        {
          "id": 4,
          "name": "Multiple"
        },
        {
          "id": 3,
          "name": "Surface"
        },
        {
          "id": 1,
          "name": "Suspended"
        },
        {
          "id": 2,
          "name": "Wall"
        }
      ],
      "sensorTypes": [
        {
          "id": 1,
          "name": "None"
        },
        {
          "id": 2,
          "name": "Normal"
        },
        {
          "id": 3,
          "name": "Low"
        },
        {
          "id": 4,
          "name": "High"
        }
      ]
    },
    "emergencyQuantity": "5",
    "fixtureId": "L2",
    "fixtureLineId": 1,
    "fixtureSize": {
      "id": 5,
      "name": "19\""
    },
    "fixtureType": {
      "id": 1,
      "name": "Accent"
    },
    "lumens": {
      "id": 6,
      "lumens": "1870"
    },
    "manufacturer": {
      "id": 8,
      "name": "MHT"
    },
    "mountType": {
      "id": 4,
      "name": "Multiple"
    },
    "notes": "L2 notes",
    "partInfo": {
      "desc_id": 47,
      "description": "MHT LED Magnetic Tube 19\" (Each fixture comes with (2) 2' sections powered by 1 sensor)",
      "model": "MHTL-MAGNT8-RC-17-2",
      "model_id": 29,
      "part_id": 30,
      "part_number": "SEN-3M1-W-MHTT1560"
    },
    "projectId": "2014-11-17 02:33:23 PM",
    "selectedAccessories": [
      {
        "$$hashKey": "object:80",
        "accessory": {
          "description": "Cable Sharing Splitter - SP12A (2 per horizontal run)",
          "part_number": "760191841"
        },
        "accessoryCount": 3
      }
    ],
    "sensorType": {
      "id": 2,
      "name": "Normal"
    },
    "standardQuantity": "10"
  },
  {
    "$$hashKey": "object:72",
    "channels": {
      "channel_count": 1,
      "id": 3
    },
    "controlMethod": {
      "id": 3,
      "name": "Sensor 3"
    },
    "controlQuantity": "1",
    "distribution": {
      "id": 2,
      "name": "Multiple"
    },
    "dropDownChoices": {
      "channels": [
        {
          "channel_count": 1,
          "id": 3
        }
      ],
      "controlMethods": [
        {
          "id": 3,
          "name": "Sensor 3"
        }
      ],
      "distributions": [
        {
          "id": 2,
          "name": "Multiple"
        }
      ],
      "fixtureSizes": [
        {
          "id": 17,
          "name": "5.75\""
        }
      ],
      "fixtureTypes": [
        {
          "id": 8,
          "name": "AC Zones (Qty)"
        },
        {
          "id": 1,
          "name": "Accent"
        },
        {
          "id": 7,
          "name": "Desk Sensor"
        },
        {
          "id": 2,
          "name": "Downlight"
        },
        {
          "id": 5,
          "name": "Fixtureless"
        },
        {
          "id": 4,
          "name": "Linear"
        },
        {
          "id": 6,
          "name": "Occupancy"
        },
        {
          "id": 10,
          "name": "Out of Scope"
        },
        {
          "id": 3,
          "name": "Troffer"
        }
      ],
      "lumens": [
        {
          "id": 35,
          "lumens": "850"
        }
      ],
      "manufacturers": [
        {
          "id": 11,
          "name": "Pathway"
        }
      ],
      "mountTypes": [
        {
          "id": 5,
          "name": "Cord"
        },
        {
          "id": 4,
          "name": "Multiple"
        },
        {
          "id": 3,
          "name": "Surface"
        },
        {
          "id": 1,
          "name": "Suspended"
        },
        {
          "id": 2,
          "name": "Wall"
        }
      ],
      "sensorTypes": [
        {
          "id": 1,
          "name": "None"
        },
        {
          "id": 2,
          "name": "Normal"
        },
        {
          "id": 3,
          "name": "Low"
        },
        {
          "id": 4,
          "name": "High"
        }
      ]
    },
    "emergencyQuantity": "5",
    "fixtureId": "L1",
    "fixtureLineId": 0,
    "fixtureSize": {
      "id": 17,
      "name": "5.75\""
    },
    "fixtureType": {
      "id": 1,
      "name": "Accent"
    },
    "lumens": {
      "id": 35,
      "lumens": "850"
    },
    "manufacturer": {
      "id": 11,
      "name": "Pathway"
    },
    "mountType": {
      "id": 5,
      "name": "Cord"
    },
    "notes": "L1 notes",
    "partInfo": {
      "desc_id": 52,
      "description": "Pathway Coventry Architectural Series (Multiple mounts and finishes)",
      "model": "C8xRW850XXXXXX",
      "model_id": 4,
      "part_id": 40,
      "part_number": "SEN-3M1-W-PATH1700"
    },
    "projectId": "2014-11-17 02:33:23 PM",
    "selectedAccessories": [
      {
        "$$hashKey": "object:82",
        "accessory": {
          "description": "10Pin Fixt-to-GW cable extender, 8\" length",
          "part_number": "CABEXT-8"
        },
        "accessoryCount": 4
      }
    ],
    "sensorType": {
      "id": 2,
      "name": "Normal"
    },
    "standardQuantity": "10"
  }
];





var mockAccessories = {
  "payload": [
    {
      "description": "Universal Gateway Wiring Harness",
      "part_number": "RG-2G-WH"
    },
    {
      "description": "RIB Relay -  10 Amp SPDT, 120-277Vac",
      "part_number": "PER-RIB21CDC"
    },
    {
      "description": "Downlight Splitter (DL12A)",
      "part_number": "760164233"
    },
    {
      "description": "Cable Sharing Splitter - SP12A (2 per horizontal run)",
      "part_number": "760191841"
    },
    {
      "description": "Sensor mounting box (open ceiling)",
      "part_number": "ADAPTER-BOX-1G"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2",
      "part_number": "ADP-MOUNT-W"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2 (20pk)",
      "part_number": "ADP-MOUNT-W-20"
    },
    {
      "description": "Sensor Mounting Bracket for ML 1x4 and 2x2 (50pk)",
      "part_number": "ADP-MOUNT-W-50"
    },
    {
      "description": "RJ45-18AWG Adapter (1 per CH)",
      "part_number": "TRM-RJ45-EU"
    },
    {
      "description": "10 pin to RJ45 fixture adapter",
      "part_number": "CAB-10PIN-RJ45"
    },
    {
      "description": "3-1 Wire Harness(3 fixtures: 1 LED gateway)",
      "part_number": "HARNESS-3-FIXTURE"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 2\" length",
      "part_number": "CABEXT-2"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 4\" length",
      "part_number": "CABEXT-4"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 6\" length",
      "part_number": "CABEXT-6"
    },
    {
      "description": "10Pin Fixt-to-GW cable extender, 8\" length",
      "part_number": "CABEXT-8"
    },
    {
      "description": "1ch fixt-adp pigtail, 36 inch length",
      "part_number": "PIGTAIL-1-FIXTURE"
    },
    {
      "description": "2ch fixt-adp pigtail, 36 inch length",
      "part_number": "PIGTAIL-2-FIXTURE"
    }
  ]
};


var mockEnginesFormData = {
  "directorCord": "250 VAC ENG-3-4834-250 North America (PC-NA-250)",
  "enginesStandard": 1,
  "enginesEmergency": 1,
  "voltageStandard": "277v",
  "voltageEmergency": "200v-250v",
  "cordStandard": "Included",
  "cordEmergency": "UK, Hong Kong, Singapore",
  "platesStandard": 2,
  "platesEmergency": 2,
  "directorCount": 1
};


var mockControlModel = {
  "spdtSwitches": 6,
  "dimmers": 6,
  "sceneControllers": 7,
  "notes": "theseAreNotes",
  "useSharedCable": true,
  "totalSharingCables": 11
};

var mockSpares = {
  "sceneControllers": 4,
  "dimmers": 4,
  "277v": 4,
  "200v-250v": 4,
  "directorSpares": 3,
  "spareSharingCables": 3,
  "emergencySpareControls": 3
};

var mockAccessoryMaster = [
  [
    "RG-2G-WH",
    {
      "count": 12,
      "desc": "Universal Gateway Wiring Harness",
      "spares": 5
    }
  ],
  [
    "ADAPTER-BOX-1G",
    {
      "count": 17,
      "desc": "Sensor mounting box (open ceiling)",
      "spares": 5
    }
  ],
  [
    "ADP-MOUNT-W",
    {
      "count": 5,
      "desc": "Sensor Mounting Bracket for ML 1x4 and 2x2",
      "spares": 5
    }
  ],
  [
    "TRM-RJ45-EU",
    {
      "count": 1,
      "desc": "RJ45-18AWG Adapter (1 per CH)",
      "spares": 5
    }
  ],
  [
    "PIGTAIL-1-FIXTURE",
    {
      "count": 4,
      "desc": "1ch fixt-adp pigtail, 36 inch length",
      "spares": 5
    }
  ]
];
