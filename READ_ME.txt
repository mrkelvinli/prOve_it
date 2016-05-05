Install:

npm install -g jasmine-node
npm install frisby --save-dev

Usage:

cd this/direcetory
jasmine-node .

Expected output for our API:
..............

Finished in 40.105 seconds
14 tests, 76 assertions, 0 failures, 0 skipped


Expected output for news API: (printing out request +JSON means that
our group doesn't believe that this is a valid response.)

...{ json: false,
  uri: 'http://bhsl.blue/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2014-02-01T00:00:00.075Z',
  body: null,
  method: 'GET',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  inspectOnFailure: false,
  baseUri: '',
  auth: { sendImmediately: true, user: 'abc', pass: 'a' },
  timeout: 10000 }
{ count: 0, next: null, previous: null, results: [] }
.{ json: false,
  uri: 'http://bhsl.blue/news_request/start_date=2015-01-01T00:00:00.075Z/end_date=2015-01-02T00:00:00.075Z/instr_list=a,b,c/tpc_list=d,e,f',
  body: null,
  method: 'GET',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  inspectOnFailure: false,
  baseUri: '',
  auth: { sendImmediately: true, user: 'abc', pass: 'a' },
  timeout: 10000 }
{ count: 0, next: null, previous: null, results: [] }
.

Finished in 6.568 seconds
5 tests, 5 assertions, 0 failures, 0 skipped

------------------ 
Possible failures:

   Message:
     Expected 500 to equal 200.

Meaning: server has not processed it and the proram is timing out, try again
and it should fix itself

