# AWS CDK Custom Resource with Singleton Python Lambda

This project demonstrates how to use AWS CDK (TypeScript) to create a custom resource backed by a singleton Python Lambda function that creates S3 buckets. The Lambda is implemented as a singleton to ensure only one instance is created per stack.

## Structure
- `lib/` - CDK stack and custom resource definition (TypeScript)
- `lambda/` - Python Lambda function code

## Usage
1. Install dependencies:
   ```sh
   npm install
   ```
2. Deploy the stack:
   ```sh
   npx cdk deploy
   ```

## Notes
- The Lambda function is implemented as a singleton using `SingletonFunction` in CDK.
- The custom resource triggers the Lambda to create S3 buckets as specified.
