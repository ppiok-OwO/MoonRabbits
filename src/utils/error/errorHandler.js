import { createResponse } from '../response/createResponse.js';
import { ErrorCodes } from './errorCodes.js';

export const handleError = (socket, error) => {
  // let responseCode;
  // let message;
  // console.log(error);
  // if (error.code) {
  //   responseCode = error.code;
  //   message = error.message;
  //   console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  // } else {
  //   responseCode = ErrorCodes.SOCKET_ERROR;
  //   message = error.message;
  //   console.error(`일반 에러: ${error.message}`);
  // }
  // const errorResponse = createResponse(-1, responseCode, { message }, null);
  // socket.write(errorResponse);
};
