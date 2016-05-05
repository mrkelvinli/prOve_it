#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://prove-it-unsw.herokuapp.com/';
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');

var priceFilePath = path.resolve(__dirname, 'input_files/stock_price.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/event_char.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size
});


frisby.create('Upload normally')
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
  // .inspectJSON()
  .expectJSON(
    { 
      log: {
        team_name: 'prOve it',
        version: 'v1',
        input_filename: [ 'stock_price.csv', 'event_char.csv' ],
        parameters_passed: {},
        exec_status: 'Successful.',
      },
    }
  )
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .toss();

// -------------------------------------

var form = new FormData();
form.append('stock_price_file', '');

form.append('stock_characteristic_file', '');


frisby.create('Uploading incorrectly formatted files')
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
  .expectJSON(
    {
      log:{
        team_name: 'prOve it',
        version: 'v1',
        input_filename: [],
        parameters_passed: {},
        exec_status: 'Invalid Request.',
      }
    }
  )
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .toss();



// -------------------------------------
var priceFilePath = path.resolve(__dirname, 'input_files/random1.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/random2.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size 
});


frisby.create('Uploading incorrectly formatted files')
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
 // .inspectJSON()
  .expectStatus(422)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON(
    {
      log: {
        team_name: 'prOve it',
        version: 'v1',
        input_filename: [ 'random1.csv', 'random2.csv' ],
        parameters_passed: {},
        exec_status: 'CSV file isn\'t formatted correctly.',
      }
    }
  )
  .toss();


// -------------------------------------
var priceFilePath = path.resolve(__dirname, 'input_files/event_char.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

frisby.create('Uploading incorrectly formatted files')
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
 // .inspectJSON()
  .expectStatus(404)
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [ 'event_char.csv' ],
      parameters_passed: {},
      exec_status: 'Invalid Request.',
    } 
   })
  .expectHeaderContains('content-type', 'application/json')
  .toss();


// -------------------------------------
var priceFilePath = path.resolve(__dirname, 'input_files/broken_event_char.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/broken_stock_price.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size 
});


frisby.create('Uploading incorrectly formatted files')
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
 // .inspectJSON()
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON(
    { log: 
   { team_name: 'prOve it',
     version: 'v1',
     input_filename: [ 'broken_event_char.csv', 'broken_stock_price.csv' ],
     parameters_passed: {},
     exec_status: 'Invalid Request.',
    } 
  })
  .toss();


// -------------------------------------
var priceFilePath = path.resolve(__dirname, 'input_files/empty1.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/empty2.csv');
var form = new FormData();

form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size
});


frisby.create('Uploading incorrectly formatted files')
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
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [ 'empty1.csv', 'empty2.csv' ],
      parameters_passed: {},
      exec_status: 'CSV file isn\'t formatted correctly.',
    }
  })
  .expectStatus(422)
  .expectHeaderContains('content-type', 'application/json')
  .toss();


// -------------------------------------
var priceFilePath = path.resolve(__dirname, 'input_files/edited_event_char.csv');
var characteristicFilePath = path.resolve(__dirname, 'input_files/edited_stock_price.csv');
var form = new FormData();
form.append('stock_price_file', fs.createReadStream(priceFilePath), {
  knownLength: fs.statSync(priceFilePath).size  // we need to set the knownLength so we can call  form.getLengthSync()
});

form.append('stock_characteristic_file', fs.createReadStream(characteristicFilePath), {
  knownLength: fs.statSync(characteristicFilePath).size 
});


frisby.create('Uploading incorrectly formatted files')
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
 // .inspectJSON()
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [ 'edited_event_char.csv', 'edited_stock_price.csv' ],
      parameters_passed: {},
      exec_status: 'Invalid Request.',
    }
  })
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .toss();
