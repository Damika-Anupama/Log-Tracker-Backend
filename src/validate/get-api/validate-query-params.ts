import { ValidationResult } from '../../models/get-request/validation/validation-result';
import { isValidDateFormat } from '../date-format-validation';
import { isValidTimeFormat } from '../time-format-validation';

export const validateQueryParam = (queryParams: any): ValidationResult => {
    const { date, from, to } = queryParams || {};
  
    if (!date || !from || !to) {
      return { isValid: false, errorMessage: 'Missing query parameters' };
    }
  
    if (!isValidDateFormat(date) || !isValidTimeFormat(from) || !isValidTimeFormat(to)) {
      return { isValid: false, errorMessage: 'Invalid date or time format' };
    }
  
    return { isValid: true };
  };