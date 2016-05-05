#!/usr/bin/env node

/* 
----NOTE----

Please read the READ_ME.txt to know why some of these tests 
print out JSON.

*/
var frisby = require('frisby');
var URL = 'http://bhsl.blue/';
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');

frisby.create('Getting results with correct authorisation')
  .get(URL+'news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-02-01T00:00:00.075Z')
  //.inspectJSON()
  .auth('abc', 'a', false)
  .timeout(10000)
  .expectStatus(200)
  .toss();

frisby.create('Getting results without authorisation')
  .get(URL+'news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-02-01T00:00:00.075Z')
  //.inspectJSON()
  .expectJSON( { detail: 'Authentication credentials were not provided.' })
  .timeout(10000)
  .expectStatus(403)
  .toss();

frisby.create('Getting results with incorrect authorisation')
  .get(URL+'news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-02-01T00:00:00.075Z')
  .timeout(10000)
  //.inspectJSON()
  .expectJSON( { detail: 'Invalid username/password.' })
  .auth('abc', 'b', false)
  .expectStatus(403)
  .toss();
frisby.create('Swapping start and end dates - should cause problems')
  .get(URL+'news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2014-02-01T00:00:00.075Z')
  .timeout(10000)
  .inspectRequest()
  .inspectJSON()
  .auth('abc', 'a', false)
  .toss();
frisby.create('adding extra params - no idea what it is meant to output')
  .get(URL+'news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2015-01-02T00:00:00.075Z/instr_list=a,b,c/tpc_list=d,e,f')
  .auth('abc', 'a', false)
  .timeout(10000)
  .inspectRequest()
  .inspectJSON()
  .toss();



