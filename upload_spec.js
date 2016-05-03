#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://prove-it-unsw.herokuapp.com/';
//var URL = 'http://localhost:3000/';
var URL_AUTH = 'http://username:password@localhost:3000/';

//frisby.globalSetup({ // globalSetup is for ALL requests
//  request: {
//    headers: { 'X-Auth-Token': 'fa8426a0-8eaf-4d22-8e13-7c1b16a9370c' }
//  }
//});
/*
//Doesn't work yet
frisby.create('POST upload files with valid input')
.post('http://prove-it-unsw.herokuapp.com/api/v1/event-study/submit-files',  {
    stock_price_file: "stock_price.csv",
    stock_characteristic_file: "event_char.csv"
  })//, {json: true})
//.timeout(10000) // 10 second timeout
.inspectJSON()
.inspectBody()
.toss()
*/


// testing upload file
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');
var priceFilePath = path.resolve(__dirname, '../event_date.csv');
var characteristicFilePath = path.resolve(__dirname, '../FarmingCompanies_6.csv');
var form = new FormData();
// form.append('stock_price_file', fs.createReadStream(priceFilePath), {
//   knownLength: fs.statSync(priceFilePath).size // we need to set the knownLength so we can call form.getLengthSync()
// });
// form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
//   knownLength: fs.statSync(characteristicFilePath).size // we need to set the knownLength so we can call form.getLengthSync()
// });

frisby.create('Valid CSV Upload')
.post(URL+'api/v1/submit-files' , form, {
  json: false,
  headers: {
    'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
    'content-length': form.getLengthSync()
  },
})
.inspectJSON()
.timeout(1000000000000)
.expectStatus(200)
.toss()
