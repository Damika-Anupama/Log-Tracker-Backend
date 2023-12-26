import { PathParam } from '../../models/get-request/path-parameters';
import { QueryParams } from '../../models/get-request/query-parameters';
import { ValidationResult } from '../../models/get-request/validation/validation-result';
import { validatePathParam } from './validate-path-param';
import { validateQueryParam } from './validate-query-params';

export const validateApiRequest = (pathParam: PathParam, queryParams: QueryParams): ValidationResult => {
  const pathValidationResult = validatePathParam(pathParam);
  const queryValidationResult = validateQueryParam(queryParams);

  if (!pathValidationResult.isValid) {
    return pathValidationResult;
  }

  if (!queryValidationResult.isValid) {
    return queryValidationResult;
  }

  return { isValid: true };
};
