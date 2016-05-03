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




frisby.create('POST upload files with no input')
.post(URL + 'api/v1/event-study/submit-files',  {

  })
.timeout(100000) // 10 second timeout
.expectStatus(404)
.expectHeaderContains('content-type', 'application/json')
.expectJSON({
  log: {
    team_name: 'prOve it',
    version: 'v1',
    exec_status: 'No CSV file.'
  }
})
 
//.inspectJSON()
//.inspectBody()
.toss()

// ---- TESTING CUMULATIVE RETURN ENDPOINT ----

frisby.create('Send request with valid input')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=Cash Rate&topic_upper_range=1.5&topic_lower_range=-1.5&token=diwvTsq7xBGGxGqtFJkT')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Send request with no input')
  .get(URL + 'api/v1/event-study/cumulative-returns')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Send request with no token')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=Cash Rate&topic_upper_range=1.5&topic_lower_range=-1.5')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [],
      parameters_passed:
      { upper_window: '5',
        lower_window: '-5',
        topic_name: 'Cash Rate',
        topic_upper_range: '1.5',
        topic_lower_range: '-1.5' },
      exec_status: 'Invalid token.'
    }
})
  //.inspectJSON()
.toss();

frisby.create('Send request with invalid token')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=Cash Rate&topic_upper_range=1.5&topic_lower_range=-1.5&token=ABCDEFG')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [],
      parameters_passed:
      { upper_window: '5',
        lower_window: '-5',
        topic_name: 'Cash Rate',
        topic_upper_range: '1.5',
        topic_lower_range: '-1.5' },
      exec_status: 'Invalid token.'
    }
})
  //.inspectJSON()
.toss();

frisby.create('Send request with invalid variable name')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=DERP&topic_upper_range=1.5&topic_lower_range=-1.5&token=diwvTsq7xBGGxGqtFJkT')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [],
      parameters_passed:
      { upper_window: '5',
        lower_window: '-5',
        topic_name: 'DERP',
        topic_upper_range: '1.5',
        topic_lower_range: '-1.5' },
      exec_status: 'Invalid topic name.'
    }
})
  //.inspectJSON()
.toss();

frisby.create('Send request where upper_window < lower_window')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=-5&lower_window=5&topic_name=Cash Rate&topic_upper_range=1.5&topic_lower_range=-1.5&token=diwvTsq7xBGGxGqtFJkT')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [],
      parameters_passed:
      { upper_window: '-5',
        lower_window: '5',
        topic_name: 'Cash Rate',
        topic_upper_range: '1.5',
        topic_lower_range: '-1.5' },
      exec_status: 'Invalid Parameters.'
    }
})
  //.inspectJSON()
.toss();

frisby.create('Send request where topic_upper_range < topic_lower_range')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=Cash Rate&topic_upper_range=-1.5&topic_lower_range=1.5&token=diwvTsq7xBGGxGqtFJkT')
  .timeout(100000) // 10 second timeout
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    log: {
      team_name: 'prOve it',
      version: 'v1',
      input_filename: [],
      parameters_passed:
      { upper_window: '5',
        lower_window: '-5',
        topic_name: 'Cash Rate',
        topic_upper_range: '-1.5',
        topic_lower_range: '1.5' },
      exec_status: 'Invalid Parameters.'
    }
})
  //.inspectJSON()
.toss();

frisby.create('Send request where topic_upper_range < topic_lower_range')
  .get(URL + 'api/v1/event-study/cumulative-returns?upper_window=5&lower_window=-5&topic_name=Cash Rate&topic_upper_range=0.2&topic_lower_range=0.1&token=diwvTsq7xBGGxGqtFJkT')
  .timeout(100000) // 100 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
      log: {
        team_name: 'prOve it',
        version: 'v1',
        input_filename: [],
        parameters_passed:
        { upper_window: '5',
          lower_window: '-5',
          topic_name: 'Cash Rate',
          topic_upper_range: '0.2',
          topic_lower_range: '0.1' },
        exec_status: 'Successful.'
      },
      Event_Cumulative_Return: []
  })
//.inspectJSON()
.toss();
