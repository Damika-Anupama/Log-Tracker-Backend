import { APIGatewayProxyResult } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { responseService } from './response-service';

export const handleError = (error: AWSError): APIGatewayProxyResult => {
    console.error(`Error: ${error}`);
    if (error.code === 'NoSuchKey') {
      return responseService.createUserErrorResponse(404, 'No logs found for the given parameters');
    }else if (error.code === 'ValidationError') {
      return responseService.createUserErrorResponse(400, 'Invalid request');
    }else if (error.code === 'AccessDenied') {
      return responseService.createUserErrorResponse(403, 'Access denied');
    }
    return responseService.createServerErrorResponse('Internal server error');
  }