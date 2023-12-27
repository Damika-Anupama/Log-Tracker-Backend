export interface isValidTimeFormatInterface {
  isValidTimeFormat: (time: string) => Promise<boolean>;
}

export function isValidTimeFormatFunction(): isValidTimeFormatInterface {
  return {
    isValidTimeFormat: async (time: string) => {
      const timeRegex = /^\d{2}:\d{2}$/;
      return timeRegex.test(time);
    }
  }
};
