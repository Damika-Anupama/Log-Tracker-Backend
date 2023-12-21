import { APIGatewayProxyEvent } from 'aws-lambda';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validatePathParam = (params: any): ValidationResult => {
  const allowedValues = ['right', 'left', 'up', 'down', 'click'];

  if (Object.values(params).length !== 1 || !allowedValues.includes(params.group)) {
    return { isValid: false, errorMessage: 'Invalid path parameter value' };
  }

  return { isValid: true };
};

export const validateQueryParam = (query: any): ValidationResult => {
  const { date, from, to } = query || {};

  if (!date || !from || !to) {
    return { isValid: false, errorMessage: 'Missing query parameters' };
  }

  if (!isValidDateFormat(date) || !isValidTimeFormat(from) || !isValidTimeFormat(to)) {
    return { isValid: false, errorMessage: 'Invalid date or time format' };
  }

  return { isValid: true };
};

const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^\d{2}:\d{2}$/;
  return timeRegex.test(time);
};

export const validateApiRequest = (event: APIGatewayProxyEvent): ValidationResult => {
  const pathValidationResult = validatePathParam(event.pathParameters);
  const queryValidationResult = validateQueryParam(event.queryStringParameters);

  if (!pathValidationResult.isValid) {
    return pathValidationResult;
  }

  if (!queryValidationResult.isValid) {
    return queryValidationResult;
  }

  return { isValid: true };
};
