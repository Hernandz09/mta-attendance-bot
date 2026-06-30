type LogArgs = unknown[];

export const logger = {
  info(message: string, ...args: LogArgs): void {
    console.log(message, ...args);
  },

  warn(message: string, ...args: LogArgs): void {
    console.warn(message, ...args);
  },

  error(message: string, ...args: LogArgs): void {
    console.error(message, ...args);
  },
};
