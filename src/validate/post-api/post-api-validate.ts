import { APIGatewayProxyEvent } from 'aws-lambda';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validatePostParams = (params: any): ValidationResult => {
  const allowedValues = ['right', 'left', 'up', 'down', 'click'];

  if (!params.group || !params.message) {
    return { isValid: false, errorMessage: 'Missing required parameters' };
  }

  if (typeof params.group !== 'string' || !allowedValues.includes(params.group)) {
    return { isValid: false, errorMessage: 'Invalid group parameter value' };
  }

  if (!isValidMessageFormat(params.message)) {
    return { isValid: false, errorMessage: 'Invalid message format' };
  }

  return { isValid: true };
};

export const validatePostApiRequest = (event: APIGatewayProxyEvent): ValidationResult => {
  const body = JSON.parse(event.body || '{}');

  const validation = validatePostParams(body);

  if (!validation.isValid) {
    return {
      isValid: false,
      errorMessage: validation.errorMessage || 'Invalid request body',
    };
  }

  return { isValid: true };
};

const isValidMessageFormat = (message: string): boolean => {
  const messageRegex = /^\(\d+,\s?\d+(\.\d+)?\)$/;

  return messageRegex.test(message);
};
