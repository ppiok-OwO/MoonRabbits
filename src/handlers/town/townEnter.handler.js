import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import { getUserSessions } from '../../session/sessions.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { config } from '../../config/config.js';
import chalk from 'chalk';
import { loadStat } from '../../db/user/user.db.js';

const townEnterHandler = async (socket, packetData) => {
  try {
    const user = getUserSessions().getUser(socket);
    if (!user)
      socket.emit(
        'error',
        new CustomError(ErrorCodes.USER_NOT_FOUND, 'getUser 에러'),
      );

    // 새 플레이어에 사용할 playerId 생성 또는 기존 ID 사용
    const playerId = socket.player.playerId;

    // DB에서 스탯 정보 로드 (playerId를 키로 사용)
    const statData = await loadStat(playerId);
    console.log('statData : ', statData);

    // PlayerSession에 추가 및 Redis 저장
    const playerSessionManager = getPlayerSession();
    const newPlayer = await playerSessionManager.addPlayer(
      socket,
      user,
      packetData.nickname,
      packetData.classCode,
      statData, // DB에서 로드한 스탯 데이터를 전달
    );
    console.log('newPlayer : ', newPlayer);

    // Redis에 playerSession 저장
    const redisKey = `playerSession:${newPlayer.id}`;
    await playerSessionManager.saveToRedis(redisKey, newPlayer);

    console.log(
      '----- Player Session 업데이트 및 Redis 저장 완료 ----- \n',
      newPlayer,
    );

    const playerInfo = newPlayer.getPlayerInfo();
    const packet = Packet.S2CEnter(playerInfo);

    socket.write(packet);

    const chatPacket = Packet.S2CChat(
      0,
      `${newPlayer.nickname}님이 입장하였습니다.`,
      'System',
    );
    getPlayerSession().notify(chatPacket);

    playerSpawnNotificationHandler(socket, packetData);
  } catch (error) {
    console.error(`${chalk.red('[createCharacterHandler Error]')} ${error}`);
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'),
    );
  }
};

export default townEnterHandler;
