import { APIGatewayProxyEvent } from 'aws-lambda';
import { getLogsHandler } from '../../../src/handlers/get-logs';

describe('getLogsHandler', () => {
  test('should return 200 status code for valid request', async () => {
     /* mock event object */
    const event: APIGatewayProxyEvent = {
      body: '',
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/logs/right',
      pathParameters: {
        group: 'test',
      },
      queryStringParameters: {
        date: '2021-10-01',
        from: '00:00',
        to: '23:59',
      },
      multiValueQueryStringParameters: {},
      stageVariables: {},
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: {},
        domainName: '',
        domainPrefix: '',
        extendedRequestId: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null,
        },
        path: '',
        protocol: '',
        requestId: '',
        requestTime: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: '',
        stage: '',
      },
      resource: '',
    };
    const result = await getLogsHandler(event);
    expect(result.statusCode).toBe(200);
  });

  // Add more tests as needed
});
