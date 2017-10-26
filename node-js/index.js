'use strict';
var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');
var fs = require('fs');
var https = require('https');
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

        // ("APA91bEMtLGWzeI-hoXDoUnhE6Bah-tlF2o1ixrJkpqDROeTbJMs6MNAu_vRmsQ6VsSazJrzs2Y0ZhWBscYNUrTI2ygk7yzc9CHn3HYJTVVwSuXEJy4j7plTvcdHM_1E9xIv89yQPA6fs9hDW4q7NIPkYzAjOi6DCw");
        // var request = new http.ClientRequest({
        //     hostname: "https://gcm-http.googleapis.com/",
        //     port: 80,
        //     path: "gcm/send",
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Content-Length": Buffer.byteLength(body)
        //     }
        // })

        // request.end(body)

    },
    'StartMeeting': function() {
        console.log("here");
        var body = {
            to: 'APA91bEMtLGWzeI-hoXDoUnhE6Bah-tlF2o1ixrJkpqDROeTbJMs6MNAu_vRmsQ6VsSazJrzs2Y0ZhWBscYNUrTI2ygk7yzc9CHn3HYJTVVwSuXEJy4j7plTvcdHM_1E9xIv89yQPA6fs9hDW4q7NIPkYzAjOi6DCw',
            data: {
                command: 'join'
            }
        };

        // var headers = {
        //     {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //     "Content-Length": Buffer.byteLength(body)
        //     }
        // };

        // var http_request = new http.ClientRequest({
        //     hostname: "gcm-http.googleapis.com",
        //     // port: 80,
        //     path: "gcm/send",
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Content-Length": Buffer.byteLength(body)
        //     }
        // });
        // var postreq = https.request(options);
        // postreq.write(body);
        // postreq.end();
        // http_request.end(JSON.stringify(body));



        const options = {
          hostname: 'gcm-http.googleapis.com',
          port: 443,
          path: '/gcm/send',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAwlQzuSE:APA91bFMV-oykqeb_fsthz8Q0v3vxZ00o4uuJDIFdXRuMF0t6aP8cYe0PPcFWckbtx5MK35rTSNSd4dpOZSDvs8hflTPqhHsf_Y0lLoYLOKNQlV3yuaoCpZy8PVH4luWL1uGtFVEj8Dm'
          }
        };
        const req = https.request(options, (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);
          res.on('data', (d) => {
            process.stdout.write(d);
          });
        });
        req.on('error', (e) => {
          console.error(e);
        });
        req.on('success', (s) => {
          console.error(res);
        });
        req.write(JSON.stringify(body));
        req.end();
        console.log(JSON.stringify(body));

        this.emit(':tell', 'joined the meeting');
    },
    'AMAZON.HelpIntent': function() {
        var speechOutPut = 'Commands available are join, mute, unmute, stop. Hope this is helpful.';
        this.emit(':tell', speechOutPut);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', 'Ok, see you in the next meeting!');
    },
};