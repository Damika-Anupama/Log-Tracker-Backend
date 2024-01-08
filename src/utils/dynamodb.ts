import { AWSError} from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';

const dynamoDB = new DynamoDB();

export const acquireLock = async (
    tableName: string,
    lockKey: string,
    lambdaId: string,
    maxRetries: number,
    retryDelayMillis: number
): Promise<void> => {
    const params = {
        TableName: tableName,
        Item: {
            LockKey: lockKey,
            LambdaId: lambdaId,
        },
        ConditionExpression: 'attribute_not_exists(LockKey)',
    };

    let retries = 0;
    while (retries < maxRetries) {
        try {
            const docClient = new DynamoDB.DocumentClient();
            await docClient.put(params).promise();
            return;
        } catch (error) {
            if ((error as AWSError).code === 'ConditionalCheckFailedException') {
                console.warn(`Failed to acquire lock, retrying (${retries + 1}/${maxRetries})`);
                await wait(retryDelayMillis);
            } else {
                console.error(`Failed to acquire lock: ${error}`);
                throw error;
            }
        }
        retries++;
    }

    throw new Error('Max retries reached. Unable to acquire lock.');
};

const wait = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds));

export const releaseLock = async (tableName: string, lockKey: string): Promise<void> => {
    const params = {
        TableName: tableName,
        Key: {
            LockKey: { S: lockKey },
        },
    };

    try {
        await dynamoDB.deleteItem(params).promise();
    } catch (error) {
        console.error(`Failed to release lock: ${error}`);
        throw error;
    }
};
