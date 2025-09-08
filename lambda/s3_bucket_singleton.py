import boto3
import cfnresponse  # Use your local cfcresponse.py

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
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {'BucketName': bucket_name})
    except Exception as e:
        cfnresponse.send(event, context, cfnresponse.FAILED, {'Message': str(e)}, reason=str(e))
