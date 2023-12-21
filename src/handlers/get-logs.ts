import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getS3Logs } from '../utils/s3';
import { AWSError } from 'aws-sdk';
import { validateApiRequest } from '../validate/get-api-validation';

interface PathParam {
  group?: string;
}

interface QueryParams {
  date?: string;
  from?: string;
  to?: string;
}

export const getLogsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params: PathParam = event.pathParameters as PathParam;
  const query: QueryParams = event.queryStringParameters as QueryParams;
  const validation = validateApiRequest(event);

  if (!validation.isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request', message: validation.errorMessage }),
    };
  }

  const { group } = params;
  const { date, from, to } = query || {};
  const { year, month, day } = date ? { year: date.slice(0, 4), month: date.slice(5, 7), day: date.slice(8, 10) } : { year: '', month: '', day: '' };

  const fromHour = from ? from.split(':')[0] : '0';
  const fromMinute = from ? from.split(':')[1] : '0';
  const toHour = to ? to.split(':')[0] : '23';
  const toMinute = to ? to.split(':')[1] : '59';

  let logs: string[] = [];

  try {
    for (let hour = Number(fromHour); hour <= Number(toHour); hour++) {
      for (let minute = Number(fromMinute); minute <= Number(toMinute); minute++) {
        const key = `${group}/${year}/${month}/${day}/logs_${hour}_${minute}.log`;
        const bucketName = process.env.SAMPLE_BUCKET ?? '';

        try {
          const logsInMinute = await getS3Logs(bucketName, key);
          if (logsInMinute.length !== 0) {
            logs.push(...logsInMinute);
          }
        } catch (error) {
          console.error(`Error getting object from S3: ${error}`);
          if ((error as AWSError).code !== ('NotFound' || "NoSuchKey")) {
            console.log(`No logs found for ${key}: ${error}`)
          } else {
            throw error;
          }
        }
      }
    }

    if (logs.length === 0) {
      const response = {
        statusCode: 404,
        body: JSON.stringify({ error: 'Content not found' }),
      };
      return response;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ logs }),
    };

    return response;
  } catch (error) {
    console.error(`Error: ${error}`);
    if ((error as AWSError).code === 'NoSuchKey') {
      const response = {
        statusCode: 404,
        body: JSON.stringify({ error: 'Content not found' }),
      };
      return response;
    }
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: error }),
    };
    return response;
  }
};
