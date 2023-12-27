import { ValidationResult } from '../../models/get-request/validation/validation-result';
import { PathParam } from '../../models/get-request/path-parameters';

export interface ValidatePathParamInterface {
  (pathParam: PathParam): ValidationResult;
}

export function validatePathParamFunction(pathParam: PathParam): ValidatePathParamInterface {
  return (pathParam) => {
    const allowedValues = ['right', 'left', 'up', 'down', 'click'];

    if (Object.values(pathParam).length !== 1 || !allowedValues.includes(pathParam.group as string)) {
      return { isValid: false, errorMessage: 'Invalid path parameter value' };
    }

    return { isValid: true };
  }
}
