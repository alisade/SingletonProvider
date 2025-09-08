import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as path from 'path';

export class S3SingletonCustomResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Singleton Python Lambda
    const bucketLambda = new lambda.SingletonFunction(this, 'S3BucketSingletonLambda', {
      uuid: 'S3BucketSingletonLambda-UUID-1234', // Change UUID if logic changes
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 's3_bucket_singleton.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.seconds(60),
      lambdaPurpose: 'CustomResourceS3Bucket',
      description: 'Singleton Lambda to create S3 buckets via custom resource',
    });

    // Grant Lambda permissions to manage S3 buckets
    bucketLambda.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: ['s3:CreateBucket', 's3:DeleteBucket'],
      resources: ['*'],
    }));

    const serviceToken = bucketLambda.functionArn;

    // Example: Create a bucket via custom resource
    const bucketNames = [
      'my-singleton-custom-bucket-123456',
      'my-singleton-custom-bucket-654321',
    ];

    bucketNames.forEach((bucketName, idx) => {
      new cdk.CustomResource(this, `MyCustomS3Bucket${idx + 1}`, {
        serviceToken,
        properties: {
          BucketName: bucketName,
        },
      });
    });
  }
}
