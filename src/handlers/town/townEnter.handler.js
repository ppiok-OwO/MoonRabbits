import { config } from '../../config/config.js';
import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import makePacket from '../../utils/packet/makePacket.js';
import Packet from '../../utils/packet/packet.js';
import payload from '../../utils/packet/payload.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';

const townEnterHandler = (socket, packetData) => {
  try {
    const player = getPlayerSession().getPlayer(socket);
    if(!player) socket.emit('error', new CustomError(ErrorCodes.USER_NOT_FOUND, 'getPlayer 에러'));
  
    player.setNewPlayerInfo(packetData.class, packetData.nickname);
    const playerInfo = player.getPlayerInfo();
  
    const packet = Packet.S_Enter(playerInfo);
  
    socket.write(packet);
  
    const chatPayload = payload.S_Chat(0, `입장하였습니다.`);
    const chatPacket = makePacket(config.packetId.S_Chat, chatPayload);
  
    socket.write(chatPacket);
  
    playerSpawnNotificationHandler(socket, packetData);
  } catch (error) {
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'));
  }
};

export default townEnterHandler;
