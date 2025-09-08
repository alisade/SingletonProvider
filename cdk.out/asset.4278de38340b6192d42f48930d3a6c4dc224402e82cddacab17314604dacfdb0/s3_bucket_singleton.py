import json
import boto3

import urllib3
import urllib.parse

def send_response(event, context, response_status, response_data, physical_resource_id=None, no_echo=False, reason=None):
    response_url = event['ResponseURL']
    response_body = {
        'Status': response_status,
        'Reason': reason or f'See the details in CloudWatch Log Stream: {context.log_stream_name}',
        'PhysicalResourceId': physical_resource_id or context.log_stream_name,
        'StackId': event['StackId'],
        'RequestId': event['RequestId'],
        'LogicalResourceId': event['LogicalResourceId'],
        'NoEcho': no_echo,
        'Data': response_data
    }
    json_response_body = json.dumps(response_body)
    headers = {
        'content-type': '',
        'content-length': str(len(json_response_body))
    }
    http = urllib3.PoolManager()
    try:
        http.request('PUT', response_url, body=json_response_body, headers=headers)
    except Exception as e:
        print(f'Failed to send response: {e}')

def handler(event, context):
    s3 = boto3.client('s3')
    props = event['ResourceProperties']
    bucket_name = props['BucketName']
    try:
        if event['RequestType'] == 'Create':
            s3.create_bucket(Bucket=bucket_name)
        elif event['RequestType'] == 'Delete':
            s3.delete_bucket(Bucket=bucket_name)
        # For Update, you could implement logic as needed
        send_response(event, context, 'SUCCESS', {'BucketName': bucket_name})
    except Exception as e:
        send_response(event, context, 'FAILED', {'Message': str(e)}, reason=str(e))
