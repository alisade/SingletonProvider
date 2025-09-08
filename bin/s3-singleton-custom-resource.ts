#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3SingletonCustomResourceStack } from '../lib/s3-singleton-custom-resource-stack';

const app = new cdk.App();
new S3SingletonCustomResourceStack(app, 'S3SingletonCustomResourceStack1');
