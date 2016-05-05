Install:

npm install -g jasmine-node
npm install frisby --save-dev

Usage:

cd this/direcetory
jasmine-node .

Expected output:
..............

Finished in 40.105 seconds
14 tests, 76 assertions, 0 failures, 0 skipped

possible failures:

   Message:
     Expected 500 to equal 200.

Meaning: server has not processed it and it's timing out, try again
and it should fix itself

