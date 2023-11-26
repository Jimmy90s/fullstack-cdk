/* eslint-disable max-lines */
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as iam from "aws-cdk-lib/aws-iam";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { IAwsAmplifyStackProps } from "../bin/types";
import { NagSuppressions } from "cdk-nag";

export class AwsAmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IAwsAmplifyStackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, "Role", {
      roleName: props.roleName,
      description: props.roleDesc,
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
    });
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess-Amplify")
    );

    // get github token from secret manager
    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "githubSecret",
      props.secretName
    );
    secret.grantRead(role);

    // buildspecs for next.js static website
    const buildSpec = codebuild.BuildSpec.fromObjectToYaml({
      version: "1.0",
      frontend: {
        phases: {
          preBuild: { commands: ["npm ci"] },
          build: { commands: ["npm run build"] },
        },
        artifacts: {
          baseDirectory: ".next",
          files: ["**/*"],
        },
        cache: { paths: ["node_modules/**/*"] },
      },
    });

    // amplify app from github repository
    const amplifyApp = new amplify.App(this, "PrintHelix", {
      appName: props.appName,
      description: props.appDesc,
      role,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.gitOwner,
        repository: props.gitRepo,
        oauthToken: secret.secretValueFromJson("secret"),
      }),
      autoBranchCreation: {
        autoBuild: true,
        patterns: [props.gitBranch],
      },
      autoBranchDeletion: true,
      buildSpec,
    });

    // add main branch
    const main = amplifyApp.addBranch("Main", {
      autoBuild: true,
      branchName: props.gitBranch,
      stage: "PRODUCTION",
    });

    const domain = amplifyApp.addDomain(props.appName);
    domain.mapRoot(main);
    domain.mapSubDomain(main, "www");

    const setPlatform = new AwsCustomResource(this, "AmplifySetPlatform", {
      onUpdate: {
        service: "Amplify",
        action: "updateApp",
        parameters: {
          appId: amplifyApp.appId,
          platform: "WEB_COMPUTE",
        },
        physicalResourceId: PhysicalResourceId.of(
          "AmplifyCustomResourceSetPlatform"
        ),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [amplifyApp.arn],
      }),
    });
    setPlatform.node.addDependency(domain);

    const setFramework = new AwsCustomResource(this, "AmplifySetFramework", {
      onUpdate: {
        service: "Amplify",
        action: "updateBranch",
        parameters: {
          appId: amplifyApp.appId,
          branchName: "main",
          framework: "Next.js - SSR",
        },
        physicalResourceId: PhysicalResourceId.of(
          "AmplifyCustomResourceSetPlatform"
        ),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE, // This allows actions on any resource
      }),
    });
    setFramework.node.addDependency(domain);

    NagSuppressions.addStackSuppressions(this, [
      { id: "AwsSolutions-IAM4", reason: "Using Amplify AWS Managed Policy." },
      { id: "AwsSolutions-IAM5", reason: "Wildcard in AWS Managed Policy." },
      {
        id: "CdkNagValidationFailure",
        reason: "Custom resource uses other node version.",
      },
      {
        id: "AwsSolutions-L1",
        reason: "Custom resource uses other node version.",
      },
    ]);
  }
}
