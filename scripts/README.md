# Stage-Aware Scripts

This directory contains Node.js scripts that support multiple deployment stages through environment variables.

## Scripts

### `export-env.js`
Exports environment variables from a CloudFormation stack to a `.env` file.

**Usage:**
```bash
STAGE_NAME=dev-ci npm run export:env
```

**Environment Variables:**
- `STAGE_NAME` (required): The stage name (e.g., `dev-ci`, `prod`)
- `AWS_REGION` (optional): AWS region, defaults to `ap-southeast-2`

### `seed-data.js`
Seeds the DynamoDB table with restaurant data for a specific stage.

**Usage:**
```bash
STAGE_NAME=dev-ci npm run seed:stage
```

**Environment Variables:**
- `STAGE_NAME` (required): The stage name
- `AWS_REGION` (optional): AWS region, defaults to `ap-southeast-2`

## NPM Scripts

The following NPM scripts are available in `package.json`:

- `deploy:stage`: Deploy CDK stack for a specific stage
- `export:env`: Export environment variables for a stage
- `seed:stage`: Seed data for a stage
- `test:stage`: Run integration tests for a stage
- `test:e2e:stage`: Run end-to-end tests for a stage
- `destroy:stage`: Destroy CDK stack for a stage

## Example Usage

```bash
# Deploy to dev-ci stage
STAGE_NAME=dev-ci npm run deploy:stage

# Export environment variables
STAGE_NAME=dev-ci npm run export:env

# Seed data
STAGE_NAME=dev-ci npm run seed:stage

# Run tests
STAGE_NAME=dev-ci npm run test:stage
STAGE_NAME=dev-ci npm run test:e2e:stage

# Clean up
STAGE_NAME=dev-ci npm run destroy:stage
```

## Benefits

1. **Reusable**: Same scripts work for any stage (dev, staging, prod)
2. **Maintainable**: No hardcoded values in CI/CD workflows
3. **Consistent**: Standardized approach across all environments
4. **Flexible**: Easy to add new stages without modifying scripts 