import { APIGatewayProxyEvent } from 'aws-lambda';
import { PathParam } from '../../models/get-request/path-parameters';
import { QueryParams } from '../../models/get-request/query-parameters';

export const validateAndParseRequest = (
  event: APIGatewayProxyEvent,
  validateApiRequest: (pathParam: PathParam, queryParams: QueryParams) => 
  { isValid: boolean; errorMessage: string }
): { pathParameters: PathParam, queryStringParameters: QueryParams } => {
  const pathParam: PathParam = event.pathParameters as PathParam;
  const queryParams: QueryParams = event.queryStringParameters as QueryParams;
  const validation = validateApiRequest(pathParam, queryParams);

  if (!validation.isValid) {
    throw new Error(validation.errorMessage);
  }

  return { pathParameters: pathParam, queryStringParameters: queryParams };
}
