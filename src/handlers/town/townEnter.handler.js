import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import { getUserSessions } from '../../session/sessions.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import chalk from 'chalk';

const townEnterHandler = (socket, packetData) => {
  try {
    const user = getUserSessions().getUser(socket);
    if (!user) socket.emit('error', new CustomError(ErrorCodes.USER_NOT_FOUND, 'getUser 에러'));
    console.log(10);
    const newPlayer = getPlayerSession().addPlayer(
      socket,
      user,
      packetData.nickname,
      packetData.classCode,
    );

    console.log('newPlayer : ', newPlayer);

    const playerInfo = newPlayer.getPlayerInfo();

    const packet = Packet.S2CTownEnter(playerInfo);

    socket.write(packet);

    const chatPacket = Packet.S2CChat(0, `${newPlayer.nickname}님이 입장하였습니다.`);
    getPlayerSession().notify(chatPacket);

    playerSpawnNotificationHandler(socket, packetData);
  } catch (error) {
    console.error(`${chalk.red('[createCharacterHandler Error]')}${error}`);
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'));
  }
};

export default townEnterHandler;
