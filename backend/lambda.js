var AWS = require('aws-sdk');
const fs = require('fs');

exports.handler = (event, context, callback) => {
    var s3 = new AWS.S3();
    console.log("Start Request");
    console.log(event);
    var params = { Bucket: 'engage-vamr2', Key: 'resource.json'}

        s3.getObject(params, function(err, data) {
          if (err) console.log("error is "+err, err.stack); // an error occurred
          else   
            {   
                console.log("File exists");
                console.log("data: "+ data.Body.toString());
                download_path = '/tmp/resource.json';
                const file = fs.createWriteStream(download_path);
                request = event;
                console.log(request.connectID+ " is req");
                obj = JSON.parse(data.Body.toString());
                obj[request.connectID] = request.registrationID;

                 console.log(JSON.stringify(obj));
                var newData = {
                    Bucket: 'engage-vamr2',
                    Key: 'resource.json',
                    Body : JSON.stringify(obj)
                }
                s3.putObject(newData, function(err, data) {
                  if (err) console.log(err, err.stack); 
                  else    {
                      console.log(newData+ " new data"); 
                      console.log(data);
                  }
                });
            }         
        });
    callback(null, 'Hello from Lambda');
};