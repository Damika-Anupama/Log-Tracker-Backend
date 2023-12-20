import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getS3Logs } from '../utils/s3';

interface pathParam {
  group?: string;
}

interface queryParams {
  date?: string;
  from?: string;
  to?: string;
  filters?: string;
}

export const getLogsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const params: pathParam = event.pathParameters as pathParam;
    const query: queryParams = event.queryStringParameters as queryParams;

    const { group } = params;
    const { date, from, to, filters } = query;
    // extract year, month, day from date
    const {year, month, day} = date ? {year: date.slice(0,4), month: date.slice(5,7), day: date.slice(8,10)} : {year: '', month: '', day: ''};

    const key = `${group}/${year}/${month}/${date}/logs_${from}_${to}.log`;

    const bucketName = process.env.SAMPLE_BUCKET ?? '';
    const logs = await getS3Logs(bucketName, key);

    const response = {
        statusCode: 200,
        body: JSON.stringify({ logs }),
    };

    return response;
};