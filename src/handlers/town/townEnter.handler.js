import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import { getUserSessions } from '../../session/sessions.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { config } from '../../config/config.js';
import chalk from 'chalk';

const townEnterHandler = async (socket, packetData) => {
  try {
    const user = getUserSessions().getUser(socket);
    if (!user) socket.emit('error', new CustomError(ErrorCodes.USER_NOT_FOUND, 'getUser 에러'));

    // PlayerSession에 추가 및 Redis 저장
    const playerSessionManager = getPlayerSession();
    const newPlayer = await playerSessionManager.addPlayer(
      socket,
      user,
      packetData.nickname,
      packetData.classCode,
    );

    // Redis에 playerSession 저장
    const redisKey = `playerSession:${newPlayer.id}`;
    await playerSessionManager.saveToRedis(redisKey, newPlayer);

    console.log('----- Player Session 업데이트 및 Redis 저장 완료 ----- \n', newPlayer);

    // console.log('newPlayer : ', newPlayer);

    const playerInfo = newPlayer.getPlayerInfo();

    const packet = Packet.S2CEnter(playerInfo);

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
