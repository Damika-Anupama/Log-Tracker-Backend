import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3();

const acquireLock = async (bucketName: string, lockKey: string, lambdaId: string): Promise<void> => {
    const params = {
        Bucket: bucketName,
        Key: lockKey,
        Body: lambdaId,
        ACL: 'private',
        // Set ACL to 'private' to ensure only the owning Lambda function can delete the lock
    };

    try {

        await s3.putObject(params).promise();
    } catch (error) {
        console.error(`Failed to acquire lock: ${error}`);
        throw error;
    }
};

const checkLockFile = async (bucketName: string, lockKey: string): Promise<boolean> => {
    const params = {
        Bucket: bucketName,
        Key: lockKey,
    };

    try {
        await s3.getObject(params).promise();
        return true;
    } catch (error) {
        if ((error as AWSError).code === ('NotFound'||"AccessDenied")) {
            console.log(`Lock file not found: ${lockKey}` + error);
            return false;
        }
        throw error;
    }
};

const wait = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const retryWriteLock = async (bucketName: string, lockKey: string, lambdaId: string, maxRetries: number): Promise<void> => {
    let retries = 0;
    while (retries < maxRetries) {
        if (!(await checkLockFile(bucketName, lockKey))) {
            await acquireLock(bucketName, lockKey, lambdaId);
            return;
        }
        await wait(800);
        retries++;
    }
    throw new Error('Max retries reached. Unable to acquire lock.');
};



export const releaseLock = async (bucketName: string, lockKey: string, lambdaId: string): Promise<void> => {
    const params = {
        Bucket: bucketName,
        Key: lockKey,
    };

    try {
        const response = await s3.getObject(params).promise();
        const ownerLambdaId = response.Body?.toString('utf-8');
        if (ownerLambdaId === lambdaId) {
            await s3.deleteObject(params).promise();
        } else {
            console.error(`Attempted to release lock owned by another Lambda function`);
            throw new Error(`Cannot release lock owned by another Lambda function`);
        }
    } catch (error) {
        console.error(`Failed to release lock: ${error}`);
        throw error;
    }
};
