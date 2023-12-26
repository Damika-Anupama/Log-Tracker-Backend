import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import 'source-map-support/register';
import { getLogsFromS3 } from '../service/get-api/get-logs-from-s3';
import { validateAndParseRequest } from '../service/get-api/validate-and-parse-request';
import { handleError } from '../service/handle-error';
import { responseService } from '../service/response-service';
import { validateApiRequest } from '../validate/get-api/get-api-validation';

export const getLogsHandler = async (
  event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
  try {
    const { pathParameters: pathParam, queryStringParameters: queryParams } = 
    validateAndParseRequest(event, validateApiRequest);

    const logs: string[] = await getLogsFromS3(pathParam, queryParams);

    return responseService.createGetLogSuccessResponse(logs);
  } catch (error) {
    return handleError(error as AWSError);
  }
};
