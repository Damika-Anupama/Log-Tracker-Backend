import S3 from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk';

const s3 = new S3();

export const getS3Logs = async (bucketName: string, key: string): Promise<string[]> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    const response = await s3.getObject(params).promise();
    const logs = response.Body?.toString('utf-8').split('\n') || [];

    return logs;
};

export const writeS3Logs = async (bucketName: string, key: string, message: string): Promise<void> => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: message + '\n',
        };

        try {
            await s3.headObject({ Bucket: bucketName, Key: key }).promise();
            params.Body = (await s3.getObject({ Bucket: bucketName, Key: key }).promise()).Body?.toString('utf-8') + params.Body;
        } catch (error) {
            if ((error as AWSError).code !== 'NotFound') {
                throw error;
            }
            // If the object does not exist, we can ignore the error and continue to putObject
        }

        await s3.putObject(params).promise();
    } catch (error) {
        console.error(`Failed to write logs to S3: ${error}`);
        throw error; // re-throw the error after logging
    }
};