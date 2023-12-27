import { ValidationResult } from '../../models/get-request/validation/validation-result';
import { isValidDateFormatInterface } from '../date-format-validation';
import { isValidTimeFormatInterface } from '../time-format-validation';
import { QueryParams } from '../../models/get-request/query-parameters';

export interface ValidateQueryParamInterface {
  (queryParams: QueryParams, dateFormatValidator: isValidDateFormatInterface, timeFormatValidator: isValidTimeFormatInterface): ValidationResult;
}

export function validateQueryParamFunction(): ValidateQueryParamInterface {
  return (queryParams: QueryParams, dateFormatValidator: isValidDateFormatInterface, timeFormatValidator: isValidTimeFormatInterface) => {
    const { date, from, to } = queryParams || {};

    if (!date || !from || !to) {
      return { isValid: false, errorMessage: 'Missing query parameters' };
    }

    if (
      !dateFormatValidator.isValidDateFormat(date) ||
      !timeFormatValidator.isValidTimeFormat(from) ||
      !timeFormatValidator.isValidTimeFormat(to)
    ) {
      return { isValid: false, errorMessage: 'Invalid date or time format' };
    }

    return { isValid: true };
  }
}
