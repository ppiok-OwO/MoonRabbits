import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const housingSaveHandler = async () => {
  try {
  } catch (error) {
    console.error(chalk.red('[housingSaveHandler Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'housingSaveHandler 에러'));
  }
};

export default housingSaveHandler;
