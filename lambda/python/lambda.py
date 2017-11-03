import boto3
import json
import re
import uuid
from botocore.errorfactory import ClientError

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    print("Start Request")
    print(event)
    try:
        file_response = s3_client.get_object( Bucket='engage-vamr', Key='resource.json')
        request = event['body']
        print(request)
        if file_response:
            print("File exists")
            download_path = '/tmp/resource'.format(uuid.uuid4(), '.json')
    
            with open(download_path, 'wb') as data:
                s3_client.download_fileobj('engage-vamr', 'resource.json', data)
    
            print("File Downloaded")
            
            with open(download_path, 'r') as content_file:
                body = content_file.read()
    
            print("Read File")
            json_content = json.loads(body)
            json_content[request['connectID']] = request['resourceToken']
    
            print("Placed Resource")
            with open(download_path, 'w') as outfile:
                json.dump(json_content, outfile)
            
            print("Added Resource")
            
            s3_client.upload_file(download_path, 'engage-vamr', 'resource.json', ExtraArgs={"ContentType": "application/json"})
            print("Resources updated")
            
            return { 
            'message' : "success"
            }
    except ClientError:
          raise Exception('Updating the collection failed') 