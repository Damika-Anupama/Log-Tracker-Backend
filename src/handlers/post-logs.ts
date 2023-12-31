import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import crypto from 'crypto';
import 'source-map-support/register';
import { writeS3Logs } from '../utils/s3';
import { validatePostApiRequest } from '../validate/post-api-validate';
import { AWSError } from 'aws-sdk';

interface EventBody {
  group: string;
  message: string;
}

interface ResponseBody {
  statusCode: number;
  body: string;
}

export const postLogsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const validation = validatePostApiRequest(event);

  if (!validation.isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request', message: validation.errorMessage }),
    };
  }

  const { group, message } = JSON.parse(event.body as string) as EventBody;

  const now = new Date();
  let hour = now.getHours() + 5;
  let minute = now.getMinutes() + 30;
  if (minute >= 60) {
    hour++;
    minute -= 60;
  }
  const key = `${group}/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/logs_${hour}_${minute}.log`;

  const bucketName = process.env.SAMPLE_BUCKET ?? '';
  //  unique identifier for each Lambda function
  const lambdaId = crypto.randomBytes(16).toString('hex');

  let response: ResponseBody = {
    statusCode: 500,
    body: JSON.stringify({ message: 'Internal server error' }),
  };

  interface ResponseBody {
    statusCode: number;
    body: string;
    headers?: { [key: string]: string };
  }

  try {
    await writeS3Logs(bucketName, key, message, lambdaId);

    response = {
      statusCode: 201,
      body: JSON.stringify({ message: 'Log created successfully' }),
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      },
    };
  } catch (error) {
    if ((error as AWSError).message === 'Max retries reached. Unable to acquire lock.') {
      response = {
        statusCode: 429,
        body: JSON.stringify({ message: 'Too many requests' }),
      };
    }else if((error as AWSError).code === 'AccessDenied'){
      response = {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access denied' }),
      };
    }
    console.error(`Error writing object to S3: ${error}`);
    response.body += `: ${error}`;
  }

  return response;
};
