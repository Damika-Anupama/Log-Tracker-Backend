import { APIGatewayProxyResult } from "aws-lambda";

export const responseService = {
    createGetLogSuccessResponse: (logs: string[]): APIGatewayProxyResult => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ logs }),
      };
      return response;
    },
  
    createUserErrorResponse: (statusCode:number, errorMessage: string): APIGatewayProxyResult => {
      const response = {
        statusCode: statusCode,
        body: JSON.stringify({ error: errorMessage }),
      };
      return response;
    },
  
    createServerErrorResponse: (errorMessage: string): APIGatewayProxyResult => {
      const response = {
        statusCode: 500,
        body: JSON.stringify({ error: errorMessage }),
      };
      return response;
    }
  }