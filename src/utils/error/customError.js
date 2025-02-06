import { ErrorCodes } from './errorCodes.js';

class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name =
      '\x1b[31m[' +
      Object.entries(ErrorCodes).find(([, value]) => value === code)[0] +
      ']\x1b[0m';
  }
}

export default CustomError;
