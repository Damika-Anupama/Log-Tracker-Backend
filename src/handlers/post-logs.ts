import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { writeS3Logs } from '../utils/s3';

interface EventBody {
  group: string;
  message: string;
}

export const postLogsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { group, message } = JSON.parse(event.body as string) as EventBody;

    const now = new Date();
    const key = `${group}/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/logs_${now.getHours()}_${now.getMinutes()}.log`;

    const bucketName = process.env.SAMPLE_BUCKET ?? '';
    await writeS3Logs(bucketName, key, message);

    const response = {
        statusCode: 201,
        body: JSON.stringify({ message: 'Log created successfully' }),
    };

    return response;
};