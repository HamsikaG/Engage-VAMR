var AWS = require('aws-sdk');
const fs = require('fs');

exports.handler = (event, context, callback) => {
    var s3 = new AWS.S3();
    console.log("Start Request");
    console.log(event);
    var params = { Bucket: 'engage-vamr2', Key: 'resource.json',  Range: 'bytes=0-1024' }

        s3.getObject(params, function(err, data) {
          if (err) console.log("error issss "+err, err.stack); // an error occurred
          else   
            {   // successful response
                console.log("File exists");
                download_path = '/tmp/resource.json';
                const file = fs.createWriteStream(download_path);
                request = event;
                                console.log("req is : "+event);   

                // const s3Promise = s3.getObject(params).promise();
                var data2 = {"connectID": request.connectID, "resourceToken": request.resourceToken}
                
                // s3Promise.then((data) => {
                //   file.write(data.Body, console.log('calling a callback')); 
                // }).catch((err) => {
                //   console.log(err);
                // });

                var newData = {
                    Bucket: 'engage-vamr2',
                    Key: 'resource.json',
                    Body : JSON.stringify(data2)
                }
                s3.putObject(newData, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else    {
                       console.log(newData+ " new data"); 
                       console.log(data);
                  }
                               // successful response
                });

                
               
            }         
        });
    callback(null, 'Hello from Lambda');
};