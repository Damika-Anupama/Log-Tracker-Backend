import { ValidationResult } from '../../models/get-request/validation/validation-result';

export const validatePathParam = (pathParam: any): ValidationResult => {
    const allowedValues = ['right', 'left', 'up', 'down', 'click'];
  
    if (Object.values(pathParam).length !== 1 || !allowedValues.includes(pathParam.group)) {
      return { isValid: false, errorMessage: 'Invalid path parameter value' };
    }
  
    return { isValid: true };
  };