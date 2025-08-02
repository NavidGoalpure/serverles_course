#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const stageName = process.env.STAGE_NAME;
const region = process.env.AWS_REGION || 'ap-southeast-2';

if (!stageName) {
  console.error('STAGE_NAME environment variable is required');
  process.exit(1);
}

const stackName = `ApiStack-${stageName}`;

console.log(`Exporting environment variables for stack: ${stackName} in region: ${region}`);

try {
  // Create or overwrite .env file
  writeFileSync('.env', '');

  // Get Lambda functions from CloudFormation stack
  const stackResourcesOutput = execSync(
    `aws cloudformation describe-stack-resources --stack-name "${stackName}" --region "${region}"`,
    { encoding: 'utf8' }
  );
  const stackResources = JSON.parse(stackResourcesOutput);

  // Extract Lambda function ARNs
  const lambdaFunctions = stackResources.StackResources
    .filter(resource => resource.ResourceType === 'AWS::Lambda::Function')
    .map(resource => resource.PhysicalResourceId);

  // Get environment variables from each Lambda function
  for (const lambdaArn of lambdaFunctions) {
    const functionConfigOutput = execSync(
      `aws lambda get-function-configuration --function-name "${lambdaArn}" --region "${region}"`,
      { encoding: 'utf8' }
    );
    const functionConfig = JSON.parse(functionConfigOutput);

    if (functionConfig.Environment && functionConfig.Environment.Variables) {
      const envVars = functionConfig.Environment.Variables;
      for (const [key, value] of Object.entries(envVars)) {
        // Check if key already exists in .env file
        const envContent = existsSync('.env') ? readFileSync('.env', 'utf8') : '';
        if (!envContent.includes(`${key}=`)) {
          writeFileSync('.env', `${key}=${value}\n`, { flag: 'a' });
        }
      }
    }
  }

  // Get CloudFormation stack outputs
  const stackOutput = execSync(
    `aws cloudformation describe-stacks --stack-name "${stackName}" --region "${region}"`,
    { encoding: 'utf8' }
  );
  const stack = JSON.parse(stackOutput);

  if (stack.Stacks[0].Outputs) {
    for (const output of stack.Stacks[0].Outputs) {
      // Check if key already exists in .env file
      const envContent = existsSync('.env') ? readFileSync('.env', 'utf8') : '';
      if (!envContent.includes(`${output.OutputKey}=`)) {
        writeFileSync('.env', `${output.OutputKey}=${output.OutputValue}\n`, { flag: 'a' });
      }
    }
  }

  console.log('.env file has been created/updated with environment variables from Lambda functions and CloudFormation stack outputs.');

} catch (error) {
  console.error('Error exporting environment variables:', error.message);
  process.exit(1);
} 