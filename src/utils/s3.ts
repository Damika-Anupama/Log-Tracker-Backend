import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { acquireLock, releaseLock } from './dynamodb';

const s3 = new S3();
const dynamoDBTableName = process.env.SAMPLE_TABLE ?? '';

export const getS3Logs = async (bucketName: string, key: string): Promise<string[]> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        const response = await s3.getObject(params).promise();
        const logs = response.Body?.toString('utf-8').split('\n') ?? [];
        return logs;
    } catch (error) {
        console.error(`Failed to get logs from S3: ${error}`);
        throw error;
    }
};

export const writeS3Logs = async (bucketName: string, key: string, message: string, lambdaId: string): Promise<void> => {
    const lockKey = `${key}.lock`;
    const maxRetries = 20; 
    const retryDelayMillis = 50;


    try {
        await acquireLock(dynamoDBTableName, lockKey, lambdaId, maxRetries, retryDelayMillis);

        let logsInMinute: string[] = [];
        try {
            logsInMinute = await getS3Logs(bucketName, key);
        } catch (error) {
            if ((error as AWSError).code !== 'NoSuchKey') {
                throw error;
            }
        }

        const timestamp = new Date().toISOString();
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: `${timestamp}: ${message}`,
        };

        if (logsInMinute.length !== 0) {
            params.Body = logsInMinute.join('\n') + '\n' + params.Body;
        }

        await s3.putObject(params).promise();
    } catch (error) {
        console.error(`Failed to write logs to S3: ${error}`);
        throw error;
    } finally {
        await releaseLock(dynamoDBTableName, lockKey);
    }
};
