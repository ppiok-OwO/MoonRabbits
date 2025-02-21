import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import { getUserSessions } from '../../session/sessions.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { config } from '../../config/config.js';
import chalk from 'chalk';
import { findPlayerByUserId, findStatByPlayerId } from '../../db/user/user.db.js';

const townEnterHandler = async (socket, packetData) => {
  try {
    const user = getUserSessions().getUser(socket);
    if (!user) socket.emit('error', new CustomError(ErrorCodes.USER_NOT_FOUND, 'getUser 에러'));

    // socket.user.userId로 Players테이블에서 유저가 보유한 플레이어 찾기
    const player = findPlayerByUserId(socket.user.userId);
    const playerStat = findStatByPlayerId(player.id);
    player.setStatInfo(playerStat);

    // PlayerSession에 추가 및 Redis 저장
    const playerSessionManager = getPlayerSession();
    playerSessionManager.players.set(socket, player);
    // const newPlayer = await playerSessionManager.addPlayer(
    //   socket,
    //   user,
    //   packetData.nickname,
    //   packetData.classCode,
    // );

    // Redis에 playerSession 저장
    const redisKey = `playerSession:${player.id}`;
    await playerSessionManager.saveToRedis(redisKey, player);

    console.log('----- Player Session 업데이트 및 Redis 저장 완료 ----- \n', player);

    // console.log('newPlayer : ', newPlayer);

    const playerInfo = player.getPlayerInfo();

    const packet = Packet.S2CEnter(playerInfo);

    socket.write(packet);

    const chatPacket = Packet.S2CChat(0, `${player.nickname}님이 입장하였습니다.`);
    getPlayerSession().notify(chatPacket);

    playerSpawnNotificationHandler(socket, packetData);
  } catch (error) {
    console.error(`${chalk.red('[createCharacterHandler Error]')} ${error}`);
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'));
  }
};

export default townEnterHandler;
