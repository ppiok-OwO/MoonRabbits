import { config } from '../../config/config.js';
import { getPlayerSession } from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';

const townEnterHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);

  player.setNewPlayerInfo(packetData.class, packetData.nickname);
  const playerInfo = player.getPlayerInfo();

  const data = payload.S_Enter(playerInfo);

  const packet = makePacket(config.packetId.S_Enter, data);

  socket.write(packet);

  playerSpawnNotificationHandler(socket, packetData);
};

export default townEnterHandler;
