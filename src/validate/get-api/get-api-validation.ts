import { time } from 'console';
import { PathParam } from '../../models/get-request/path-parameters';
import { QueryParams } from '../../models/get-request/query-parameters';
import { ValidationResult } from '../../models/get-request/validation/validation-result';
import { isValidDateFormatInterface } from '../date-format-validation';
import { isValidTimeFormatInterface } from '../time-format-validation';
import { ValidatePathParamInterface } from './validate-path-param';
import { ValidateQueryParamInterface } from './validate-query-params';

export interface ValidateApiRequestInterface {
  (pathParam: PathParam, queryParams: QueryParams,
    validateQueryParam: ValidateQueryParamInterface,
    validatePathParam: ValidatePathParamInterface,
    dateFormatValidator: isValidDateFormatInterface,
    timeFormatValidator: isValidTimeFormatInterface
  ): ValidationResult;
}

export function validateApiRequestFunction(): ValidateApiRequestInterface {
  return (
    pathParam: PathParam, queryParams: QueryParams,
    validateQueryParam: ValidateQueryParamInterface,
    validatePathParam: ValidatePathParamInterface,
    dateFormatValidator: isValidDateFormatInterface,
    timeFormatValidator: isValidTimeFormatInterface
  ) => {
    const pathValidationResult = validatePathParam(pathParam);
    const queryValidationResult = validateQueryParam(
      queryParams, dateFormatValidator, timeFormatValidator
    );

    if (!pathValidationResult.isValid) {
      return pathValidationResult;
    }

    if (!queryValidationResult.isValid) {
      return queryValidationResult;
    }

    return { isValid: true };
  }
}
