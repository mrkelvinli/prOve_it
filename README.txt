We use the Frisby javascript package to test our software. To run our test scripts, please install node.js and the required packages (jasmine-node, frisby)

Install jasmine-node
$ sudo npm install -g jasmine-node

Install Frisby
$ sudo npm install -g frisby


Run the test files with jasmine-node that end with _spec.js
For example
$ jasmine-node abc_spec.js
will run the test file abc_spec.js with jasmine-node

Our test files are: upload_spec.js, cum_return_spec.js and wolfofbridgestAPI_spec.js

upload_spec.js is a JavaScript testing script for testing our upload files endpoint

cum_return_spec.js is a JavaScript testing script to test our cumulative return endpoint

wolfofbridgestAPI_spec.js is a script for our tests on the team Wolf Of Bridge Street, we tested both uploading files and a parameterized cumulative return API call.