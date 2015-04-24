var EventEmitter = require("events").EventEmitter;
var https = require("https");
var util = require("util");


/**
 An EventEmitter to get hisorical stock prices using Yahoo Finance Api
 @param symbol
 @constructor
*/

function stock(symbol) {

    EventEmitter.call(this);
    stockEmitter = this;

    var start = "2015-04-20";
    var end = "2015-04-24";
    //Connect to the API URL (http://teamtreehouse.com/username.json)

    var request = https.get("https://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +symbol+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys", function (response) {

        var body = "";
        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            stockEmitter.emit("error", new Error("There was an error getting the data for " + symbol + ". (" + http.STATUS_CODES[response.statusCode] + ")"));

        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            stockEmitter.emit("data", chunk);
        });


        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var stock = JSON.parse(body);
                    stockEmitter.emit("end", stock);
                } catch (error) {
                    stockEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            stockEmitter.emit("error", error);
        });
    });
}


util.inherits(stock, EventEmitter);

module.exports = stock;
