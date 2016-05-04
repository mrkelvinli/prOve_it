#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://prove-it-unsw.herokuapp.com/';
//var URL = 'http://localhost:3000/';
var URL_AUTH = 'http://username:password@localhost:3000/';

// testing upload file
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');
var characteristicFilePath = path.resolve(__dirname, '../event_date.csv');
var priceFilePath = path.resolve(__dirname, '../FarmingCompanies_6.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size         // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size       // we need to set the knownLength so we can call  form.getLengthSync()
});


frisby.create('post files')
  .post(URL+'api/v1/event-study/submit-files',
  form,
  {
    json: false,
    headers: {
      'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
      'content-length': form.getLengthSync()
    }
  })
  .timeout(100000)
  .inspectJSON()
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .toss();
