export const isValidTimeFormat = (time: string): boolean => {
    const timeRegex = /^\d{2}:\d{2}$/;
    return timeRegex.test(time);
  };