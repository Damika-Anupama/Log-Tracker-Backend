import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import 'source-map-support/register';
import { getLogsFromS3 } from '../service/get-api/get-logs-from-s3';
import { handleError } from '../service/handle-error';
import { responseService } from '../service/response-service';
import { ValidateApiRequestInterface } from '../validate/get-api/get-api-validation';
import { ValidateAndParseRequestInterface } from '../service/get-api/validate-and-parse-request';
import { ValidateQueryParamInterface } from '../validate/get-api/validate-query-params';
import { ValidatePathParamInterface } from '../validate/get-api/validate-path-param';
import { isValidDateFormatInterface } from '../validate/date-format-validation';
import { isValidTimeFormatInterface } from '../validate/time-format-validation';

export const getLogsHandler = async (
  event: APIGatewayProxyEvent,
  validateApiRequest: ValidateApiRequestInterface,
  validateQueryParam: ValidateQueryParamInterface,
  validatePathParam: ValidatePathParamInterface,
  dateFormatValidator: isValidDateFormatInterface,
  timeFormatValidator: isValidTimeFormatInterface,
  validateAndParseRequest: ValidateAndParseRequestInterface

): Promise<APIGatewayProxyResult> => {
  try {
    const { pathParameters: pathParam, queryStringParameters: queryParams } =
      validateAndParseRequest(event, validateApiRequest, validateQueryParam, validatePathParam, dateFormatValidator, timeFormatValidator)

    const logs: string[] = await getLogsFromS3(pathParam, queryParams);

    return responseService.createGetLogSuccessResponse(logs);
  } catch (error) {
    return handleError(error as AWSError);
  }
};
