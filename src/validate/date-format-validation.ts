export interface isValidDateFormatInterface {
    isValidDateFormat: (date: string) => Promise<boolean>;
  }

export function isValidDateFormatFunction(): isValidDateFormatInterface {
    return{
        isValidDateFormat: async (date: string) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(date);
          }
    }
  };
