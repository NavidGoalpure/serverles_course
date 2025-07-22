import { handler } from './functions/ get-index.mjs';

// Mock API Gateway event
const mockEvent = {
  httpMethod: 'GET',
  path: '/',
  headers: {},
  queryStringParameters: null,
  pathParameters: null,
  body: null
};

// Mock context
const mockContext = {
  functionName: 'test-function',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/test-function',
  logStreamName: '2023/01/01/[$LATEST]test-stream',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {}
};

async function testHandler() {
  try {
    console.log('Testing Lambda function...');
    const result = await handler(mockEvent, mockContext);
    console.log('Response:', result);
    
    if (result.statusCode === 200) {
      console.log('✅ Function executed successfully!');
      console.log('HTML content length:', result.body.length, 'characters');
    } else {
      console.log('❌ Function returned error status:', result.statusCode);
    }
  } catch (error) {
    console.error('❌ Error testing function:', error);
  }
}

testHandler(); 