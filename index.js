'use strict';
var Alexa = require('alexa-sdk');
var aws = require('aws-sdk');
var request = require('request').defaults({jar: true});

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event,context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        console.log("in launch request");
        this.emit(':tell', 'I am in launch request')
    },
    'AMAZON.HelpIntent': function() {
        var speechOutPut = 'Ask about status of devices';
        this.emit(':ask', speechOutPut);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    },
};