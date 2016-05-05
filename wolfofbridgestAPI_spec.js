#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://www.wolfofbridgest.com/';
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');
var token = '5D7F960526BD4246AC6D';

var priceFilePath = path.resolve(__dirname, 'input_files/stock_price.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/event_char.csv');
var form = new FormData();
form.append('stock_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('event_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size
});


frisby.create('Upload normally')
  .post(URL+'api/v4.0/event_study_files/',
  form,
  {
    json: false,
    headers: {
      'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
      'content-length': form.getLengthSync()
    }
  })
  .timeout(100000)
<<<<<<< HEAD
  //.inspectJSON()
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON(
    {
      "log": {
        "developerTeam": "Wolf Of Bridge St",
        "input": [
          "stock_price.csv",
          "event_char.csv"
        ],
        "moduleName": "Event Study",
        "moduleVersion": "v4.0",
        "parameters": [],
        "response": "Success",
      },
    }
  )
.toss();

frisby.create('Send request for cumulative return for China_Growth_Rate_Change and all companies')
  .get(URL + 'api/v4.0/cumulative_returns/?token='+token+'&lower_win=-5&upper_win=5&event_type=China_Growth_Rate_Change&China_Growth_Rate_Change_lower=0&China_Growth_Rate_Change_upper=2')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON(
    {
      "log": {
        "developerTeam": "Wolf Of Bridge St",
        "input": [],
        "moduleName": "Event Study",
        "moduleVersion": "v4.0",
        "parameters": {
          "China_Growth_Rate_Change_lower": 0,
          "China_Growth_Rate_Change_upper": 2,
          "event_type": [
            "China_Growth_Rate_Change"
          ],
          "lower_win": -5,
          "token": "5D7F960526BD4246AC6D",
          "upper_win": 5
        },
        "response": "Success",
      },
      "output": {
        "average": [
          -0.006667,
          -0.01,
          -0.006667,
          -0.006667,
          -0.006667,
          -0.015,
          -0.001667,
          -0.006667,
          -0.01,
          -0.013333,
          -0.013333
        ],
        "cumulativeReturns": {
          "AAC.AX": {
            "cumulativeReturns": [
              -0.02,
              -0.03,
              -0.02,
              -0.02,
              -0.02,
              -0.045,
              -0.005,
              -0.02,
              -0.03,
              -0.04,
              -0.04
            ],
            "events": [
              {
                "eventDate": "2012-07-30",
                "eventType": "China_Growth_Rate_Change",
                "eventValue": 1
              }
            ]
          },
          "BGA.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "CCL.AX": {
            "cumulativeReturns": [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "events": [
              {
                "eventDate": "2014-10-06",
                "eventType": "China_Growth_Rate_Change",
                "eventValue": 1
              }
            ]
          },
          "CGC.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "ELD.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "ELDDA.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "FGL.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "GFF.AX": {
            "cumulativeReturns": [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "events": [
              {
                "eventDate": "2014-10-06",
                "eventType": "China_Growth_Rate_Change",
                "eventValue": 1
              }
            ]
          },
          "GNC.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "RIC.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "SHV.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "TGR.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "TWE.AX": {
            "cumulativeReturns": [],
            "events": []
          },
          "WBA.AX": {
            "cumulativeReturns": [],
            "events": []
          }
        }
      }
    }
  )
.toss();

return;