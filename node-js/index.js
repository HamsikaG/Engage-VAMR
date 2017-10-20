'use strict';
var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');
var fs = require('fs');
var request = require('request').defaults({jar: true});

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event,context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var context = this;
        console.log("in launch request");
        this.emit(':tell', 'I am in launch request');

        var s3 = new AWS.S3();
        var params = {Bucket: 'engage-vamr', Key: 'resource.json'};
        // var obj = s3.getObject(params, function(err, data) {
        //     console.log("here");
        //     if (err) console.log(err, err.stack); // an error occurred
        //     // else     console.log("DATA: " + data);           // successful response
        //     var test = data.Body.toString();
        //     console.log(test);
        // });
        // console.log(obj.response)
        //console.log(obj)
        // var file = fs.createWriteStream('/tmp/info.txt');
        // s3.getObject(params).createReadStream().pipe(file);
        // // var test = fs.readFile('/tmp/info.json', 'utf8');
        // try {
        //    var data = fs.readFileSync('/tmp/info.txt', 'utf8');
        //     console.log(data);
        // } catch(e) {
        //     console.log('Error:', e.stack);
        // }
        // console.log(test);
        // var t = JSON.parse(test);
        // console.log(t);
        console.log("reading the file")
        ("APA91bEMtLGWzeI-hoXDoUnhE6Bah-tlF2o1ixrJkpqDROeTbJMs6MNAu_vRmsQ6VsSazJrzs2Y0ZhWBscYNUrTI2ygk7yzc9CHn3HYJTVVwSuXEJy4j7plTvcdHM_1E9xIv89yQPA6fs9hDW4q7NIPkYzAjOi6DCw");
    },
    'AMAZON.HelpIntent': function() {
        var speechOutPut = 'Ask about the meeting';
        this.emit(':ask', speechOutPut);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', 'Ok, see you in the next meeting!');
    },
};