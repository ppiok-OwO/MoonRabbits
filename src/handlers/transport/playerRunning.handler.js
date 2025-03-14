import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';

export const playerRunningHandler = (socket, packetData) => {
  try {
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);
    if (!player) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    return (player.isRunning = true);
  } catch (error) {
    handleError(socket, error);
  }
};
