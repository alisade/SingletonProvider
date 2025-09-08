"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3SingletonCustomResourceStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const cr = __importStar(require("aws-cdk-lib/custom-resources"));
const path = __importStar(require("path"));
class S3SingletonCustomResourceStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        // Custom Resource Provider
        const provider = new cr.Provider(this, 'S3BucketProvider', {
            onEventHandler: bucketLambda,
        });
        // Example: Create a bucket via custom resource
        new cdk.CustomResource(this, 'MyCustomS3Bucket', {
            serviceToken: provider.serviceToken,
            properties: {
                BucketName: 'my-singleton-custom-bucket-123456',
            },
        });
    }
}
exports.S3SingletonCustomResourceStack = S3SingletonCustomResourceStack;
