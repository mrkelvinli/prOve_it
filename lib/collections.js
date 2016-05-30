Files = new Mongo.Collection('files');

Raw_CR_CSV = new Mongo.Collection('raw_cr_csv');

// Store every possible event and it's average cumulative return with upper and lower windows are 5 and -5 respectivity
Stocks = new Mongo.Collection('stocks');
Events = new Mongo.Collection('events');
Topics = new Mongo.Collection('topics');
Companys = new Mongo.Collection('companys');




// new

StockPrices = new Mongo.Collection('stockPrices');
StockEvents = new Mongo.Collection('stockEvents');
Market      = new Mongo.Collection('market');
Regressions = new Mongo.Collection('regressions');
