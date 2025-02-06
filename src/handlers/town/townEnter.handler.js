import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';

const townEnterHandler = (socket, packetData) => {
  try {
    const player = getPlayerSession().getPlayer(socket);
    if(!player) socket.emit('error', new CustomError(ErrorCodes.USER_NOT_FOUND, 'getPlayer 에러'));
  
    player.setNewPlayerInfo(packetData.class, packetData.nickname);
    const playerInfo = player.getPlayerInfo();
  
    const packet = Packet.S_Enter(playerInfo);
  
    socket.write(packet);
  
    const chatPacket = Packet.S_Chat(0, `${player.nickname}님이 입장하였습니다.`);
    getPlayerSession().notify(chatPacket);
  
    playerSpawnNotificationHandler(socket, packetData);
  } catch (error) {
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'));
  }
};

export default townEnterHandler;
