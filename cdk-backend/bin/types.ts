import { StackProps } from "aws-cdk-lib";

// Amplify Hosting Stack Props
export interface IAwsAmplifyStackProps extends StackProps {
  roleName: string;
  roleDesc: string;
  secretName: string;
  appName: string;
  appDesc: string;
  gitOwner: string;
  gitRepo: string;
  gitBranch: string;
}

// Table interfaces
export interface ISecondayIndexes {
  indexName: string;
  partionKeyName: string;
  sortingKey: string;
}

interface ITable {
  name: string;
  partionKey: string;
  sortingKey: string;
  secondaryIndexes: ISecondayIndexes[];
}

// Storage Stack Props
export interface IAwsStorageStackProps extends StackProps {
  kms: {
    alias: string;
    desc: string;
  };
  s3: {
    name: string;
  };
  dynamodb: {
    customerTable: ITable;
    ordersTable: ITable;
  };
}

// Cognito Auth Stack
export interface IAwsCognitoStackProps extends StackProps {
  imports: {
    bucketArn: string;
    tableArn: string;
    kmsKeyArn: string;
    googleSecretName: string;
    facebookSecretName: string;
    acmArn: string;
    hostedZoneId: string;
  };
  domain: string;
  cognitoDomain: string;
  userPoolName: string;
  postSignupLambdaName: string;
  userPoolClientName: string;
  identityPoolName: string;
  authenticatedUserName: string;
  unAuthenticatedUserName: string;
  email: {
    subject: string;
    body: string;
    from: string;
    name: string;
    replyTo: string;
  };
  callbackUrls: string[];
  logoutUrls: string[];
  redirectUri: string;
}
