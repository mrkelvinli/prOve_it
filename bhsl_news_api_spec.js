#!/usr/bin/env node

var frisby = require('frisby');

var URL = 'http://bhsl.blue';
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');
// ---- TESTING NEWS API ENDPOINT ----

frisby.create('Send request with maxmimum date range')
  .get(URL + '/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-01-01T00:00:00.075Z/')
  .auth('kelvin','k')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Send request with custom date range')
  .get(URL + '/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2015-02-01T00:00:00.075Z/')
  .auth('kelvin','k')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Send request with a single company (All Topics)')
  .get(URL + '/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-01-01T00:00:00.075Z/instr_list=ANZ.AX/tpc_list=*/')
  .auth('kelvin','k')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();

frisby.create('Send request with a single company (All Topics)')
  .get(URL + '/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2016-01-01T00:00:00.075Z/instr_list=ANZ.AX,WOW.AX/tpc_list=*/')
  .auth('kelvin','k')
  .timeout(100000) // 10 second timeout
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
.toss();
