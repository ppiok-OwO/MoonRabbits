import { getUserSessions } from '../session/sessions.js';
import handleError from '../utils/error/errorHandler.js';

export const pongHandler = (socket, packetData) => {
  try {
    const { timestamp } = packetData;
    const milliseconds = timestampToMillis(timestamp);
    const userSession = getUserSessions();
    const user = userSession.getUser(socket);

    return user.handlePong(milliseconds);
  } catch (error) {
    console.error(error);
    handleError(socket, error);
  }
};

function timestampToMillis(timestamp) {
  return timestamp.high * 2 ** 32 + timestamp.low;
}
