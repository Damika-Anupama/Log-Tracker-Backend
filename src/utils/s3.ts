import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3();

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

export const writeS3Logs = async (bucketName: string, key: string, message: string): Promise<void> => {
    try {
        let logsInMinute: string[] = [];
        try {
            logsInMinute = await getS3Logs(bucketName, key);
        } catch (error) {
            if ((error as AWSError).code !== 'NotFound') {
                console.log(`No logs found for ${key}: ${error}`);
            } else {
                throw error;
            }
        }

        const timestamp = new Date().toISOString();
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: `${timestamp}: ${message}`
        };

        if (logsInMinute.length !== 0) {
            params.Body = logsInMinute.join("\n") + '\n' + params.Body;
        }

        await s3.putObject(params).promise();
    } catch (error) {
        console.error(`Failed to write logs to S3: ${error}`);
        throw error;
    }
};