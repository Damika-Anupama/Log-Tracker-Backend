import { APIGatewayProxyEvent } from 'aws-lambda';
import { PathParam } from '../../models/get-request/path-parameters';
import { QueryParams } from '../../models/get-request/query-parameters';
import { ValidateApiRequestInterface } from '../../validate/get-api/get-api-validation';
import { ValidateQueryParamInterface } from '../../validate/get-api/validate-query-params';
import { ValidatePathParamInterface } from '../../validate/get-api/validate-path-param';
import { isValidDateFormatInterface } from '../../validate/date-format-validation';
import { isValidTimeFormatInterface } from '../../validate/time-format-validation';

export interface ValidateAndParseRequestInterface {
  (event: APIGatewayProxyEvent,
    validateApiRequest: ValidateApiRequestInterface,
    validateQueryParam: ValidateQueryParamInterface,
    validatePathParam: ValidatePathParamInterface,
    dateFormatValidator: isValidDateFormatInterface,
    timeFormatValidator: isValidTimeFormatInterface
  ): {
    pathParameters: PathParam, queryStringParameters: QueryParams
  };
}

export function validateAndParseRequestFunction(): ValidateAndParseRequestInterface {
  return (
    event: APIGatewayProxyEvent,
    validateApiRequest: ValidateApiRequestInterface,
    validateQueryParam: ValidateQueryParamInterface,
    validatePathParam: ValidatePathParamInterface,
    dateFormatValidator: isValidDateFormatInterface,
    timeFormatValidator: isValidTimeFormatInterface,
  ) => {
    const pathParam: PathParam = event.pathParameters as PathParam;
    const queryParams: QueryParams = event.queryStringParameters as QueryParams;
    const validation = validateApiRequest(
      pathParam, queryParams, validateQueryParam,
      validatePathParam,
      dateFormatValidator,
      timeFormatValidator);

    if (!validation.isValid) {
      throw new Error(validation.errorMessage);
    }

    return { pathParameters: pathParam, queryStringParameters: queryParams };
  }
}
