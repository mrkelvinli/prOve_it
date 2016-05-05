#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://www.wolfofbridgest.com/';
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');

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
  .post(URL+'api/v4.0/event_study_files',
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
  // .expectHeaderContains('content-type', 'application/json')
  .toss();
return;