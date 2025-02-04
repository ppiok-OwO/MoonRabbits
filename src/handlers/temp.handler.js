import { socketManager } from '../session/sessions.js';

const tempHandler = (socket, payload) => {
  // 이런 저런 처리

  socketManager.sendPacket(playerId);
  socketManager.sendNotification();
};
