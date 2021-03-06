'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */


// --------------- Helpers that build all of the responses -----------------------

var AWS = require('aws-sdk');
const fs = require('fs');

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to engage V A M';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me which meeting you want to join by saying, ' +
        'join 12:00 PM meeting';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function joinMeeting(time) {
    return {
        time,
    };
}

function sendCommand(body) {
    
    var options = {
        method: 'POST',
        hostname: 'gcm-http.googleapis.com',
        path: '/gcm/send',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "key=AAAAwlQzuSE:APA91bFMV-oykqeb_fsthz8Q0v3vxZ00o4uuJDIFdXRuMF0t6aP8cYe0PPcFWckbtx5MK35rTSNSd4dpOZSDvs8hflTPqhHsf_Y0lLoYLOKNQlV3yuaoCpZy8PVH4luWL1uGtFVEj8Dm",
        } 
    }
     
    var https = require('https');
      var req =  https.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      console.log('Headers: ' + JSON.stringify(res.headers));
    });
    
     req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    req.end(body);
    
}
 
  function generateBody(connectID, commandobj, callback){
       var s3 = new AWS.S3();
     var params = { Bucket: 'engage-vamr2', Key: 'resource.json'};
     var regID = null;
        s3.getObject(params, function(err, data) {
          if (err){
              console.log("error is "+err, err.stack); // an error occurred
          } 
          else   
            {    
                var connectID ="hi";
                console.log("File exists");
                console.log("data: "+ data.Body.toString());
                var obj = JSON.parse(data.Body.toString());

                console.log(obj[connectID] + " is obj[connectID");
                regID = obj[connectID];
                console.log(regID+ " is regID");
                
                
                commandobj.to = regID
                callback(commandobj);
            }
        });
      
  }
  
function startMeetingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const Slot = intent.slots.time;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    console.log("slot : " + Slot.value);

    if (Slot) {
        const time = Slot.value;
        sessionAttributes = joinMeeting(time);
        
        var obj = {
                "data" : {
                  "command": "start"
                }
            };

        if(time)
            {
                speechOutput = `Starting ${time} meeting. Would you like me to join the meeting? Please say join meeting. `;
                repromptText = `Starting ${time} meeting.`;
                obj.data.time = time;
            }
        else
        {
            speechOutput = `Starting next meeting. Would you like me to join the meeting? Please say join meeting.`;
            repromptText = `Starting next meeting.`; 
        }

        generateBody("hi", obj, (commandobj) => {
            var body = JSON.stringify(commandobj);
            sendCommand(body);
        });
        
    } else {
        speechOutput = "There was an Issue starting meeting";
        repromptText = "There was an Issue starting meeting";
    }


    

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function joinMeetingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const Slot = intent.slots.time;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    console.log("slot : " + Slot.value);

    if (Slot) {
        const time = Slot.value;
        sessionAttributes = joinMeeting(time);
        speechOutput = `Joining Meeting`;
        repromptText = `Joining Meeting`;
        
        var obj = {
                "data" : {
                  "command": "join"
                }
            };

        generateBody("hi", obj, (commandobj) => {
            var body = JSON.stringify(commandobj);
            sendCommand(body);
        });
        
    } else {
        speechOutput = "Exiting Out of Meeting";
        repromptText = "Exiting Out of Meeting";
    }


    

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


function muteMeetingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';  
    if (cardTitle=='MuteMeeting') {
       
        speechOutput = `muting Meeting.`;
        repromptText = `muting Meeting`;
          
        var obj = {
                "data" : {
                  "command": "mute"
                }
            };

        generateBody("hi", obj, (commandobj) => {
            var body = JSON.stringify(commandobj);
            sendCommand(body);
        });
        
    } else {
        speechOutput = "cannot mute Meeting";
        repromptText = "cannot mute Meeting";
    }


    

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function unmuteMeetingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = ''; 
    if (cardTitle=='UnMuteMeeting') {
       
        speechOutput = `Unmuting Meeting.`;
        repromptText = `Unmuting Meeting`;
        
        var obj = {
                "data" : {
                  "command": "unmute"
                }
            };

        generateBody("hi", obj, (commandobj) => {
            var body = JSON.stringify(commandobj);
            sendCommand(body);
        });
        
    } else {
        speechOutput = "cannot unmute Meeting";
        repromptText = "cannot unmute Meeting";
    }


    

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function endMeetingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = ''; 
    if (cardTitle=='EndMeeting') {
       
        speechOutput = `Ending Meeting.`;
        repromptText = `Ending Meeting`;
        
        var obj = {
                "data" : {
                  "command": "end"
                }
            };

        generateBody("hi", obj, (commandobj) => {
            var body = JSON.stringify(commandobj);
            sendCommand(body);
        });
        
    } else {
        speechOutput = "cannot end Meeting";
        repromptText = "cannot end Meeting";
    }


    

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
        if (intentName === 'StartMeeting') {
            startMeetingInSession(intent, session, callback); 
        }
        else if (intentName === 'JoinMeetingRoom'){ 
        joinMeetingInSession(intent, session, callback); 
        }
         else if (intentName === 'MuteMeeting'){ 
        muteMeetingInSession(intent, session, callback); 
        }
         else if (intentName === 'UnMuteMeeting'){ 
        unmuteMeetingInSession(intent, session, callback); 
        }
         else if (intentName === 'EndMeeting'){ 
        endMeetingInSession(intent, session, callback); 
        }
     else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
         handleSessionEndRequest(callback);
    } 
    else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */
    

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
