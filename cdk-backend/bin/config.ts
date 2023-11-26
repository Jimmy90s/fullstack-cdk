import {
  IAwsAmplifyStackProps,
  IAwsCognitoStackProps,
  IAwsStorageStackProps,
} from "./types";

export const amplifyStackConfig: IAwsAmplifyStackProps = {
  roleName: "amplify-role",
  roleDesc: "role used for amplify",
  secretName: "github-token",
  appName: "domain.com",
  appDesc: "amplify webshop",
  gitOwner: "GitHub",
  gitRepo: "repository",
  gitBranch: "main",
};

export const storageStackConfig: IAwsStorageStackProps = {
  kms: {
    alias: "alias/key",
    desc: "EncryptionKey",
  },
  s3: {
    name: "images-bucket",
  },
  dynamodb: {
    customerTable: {
      name: "customer-table",
      partionKey: "account_id",
      sortingKey: "account_name",
      secondaryIndexes: [
        {
          indexName: "email_index",
          partionKeyName: "account_email",
          sortingKey: "account_id",
        },
      ],
    },
    ordersTable: {
      name: "customer-orders",
      partionKey: "account_id",
      sortingKey: "order_id",
      secondaryIndexes: [
        {
          indexName: "order_id",
          partionKeyName: "order_id",
          sortingKey: "order_date",
        },
        {
          indexName: "order_date_index",
          partionKeyName: "order_date",
          sortingKey: "shipment_date",
        },
        {
          indexName: "shipment_date_index",
          partionKeyName: "shipment_date",
          sortingKey: "order_date",
        },
        {
          indexName: "order_status_index",
          partionKeyName: "order_status",
          sortingKey: "order_date",
        },
      ],
    },
  },
};

export const authStackConfig: IAwsCognitoStackProps = {
  imports: {
    bucketArn: "myBucketArn",
    tableArn: "myTableArn",
    kmsKeyArn: "myKmsArn",
    googleSecretName: "myGoogleClientSecret",
    facebookSecretName: "myFacebookClientSecret",
    acmArn: "usEast1Certificate",
    hostedZoneId: "myRoute53HostedZondeId",
  },
  domain: "domain.com",
  cognitoDomain: "auth.domain.com",
  postSignupLambdaName: "post-signup-trigger",
  userPoolName: "userpool",
  identityPoolName: "identitypool",
  userPoolClientName: "userpool-client",
  authenticatedUserName: "auth-role",
  unAuthenticatedUserName: "unauth-role",
  email: {
    subject: "Account Verification",
    body: `Welcome to domain!
Click on the link to verify your email {##Verify Email##}`,
    from: "noreply@domain.com",
    name: "domain",
    replyTo: "support@domain.com",
  },
  callbackUrls: [
    "https://domain.com",
    "https://domain.com/design",
    "https://domain.com/checkout",
  ],
  logoutUrls: [
    "https://domain.com",
    "https://domain.com/design",
    "https://domain.com/checkout",
    "https://domain.com/login",
  ],
  redirectUri: "https://domain.com/",
};
