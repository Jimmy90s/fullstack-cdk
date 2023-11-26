#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsAmplifyStack } from "../lib/aws-amplify-stack";
import {
  amplifyStackConfig,
  storageStackConfig,
  authStackConfig,
} from "./config";
import { AwsStorageStack } from "../lib/aws-storage-stack";
import { AwsCognitoStack } from "../lib/aws-cognito-stack";

const app = new cdk.App();
//new CdkBackendStack(app, "CdkBackendStack", {});
new AwsAmplifyStack(app, "amplify-stack", amplifyStackConfig);
new AwsStorageStack(app, "ph-storage-stack", storageStackConfig);
// new AwsCognitoStack(app, "cognito-stack", authStackConfig);
