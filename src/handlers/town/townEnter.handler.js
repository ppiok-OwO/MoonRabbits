import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import { getUserSessions } from '../../session/sessions.js';

import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import chalk from 'chalk';
import { loadStat, updateInventory } from '../../db/user/user.db.js';
import RedisSession from '../../classes/session/redisSession.class.js';
import { inventoryUpdateHandler } from '../player/inventory/inventoryUpdate.handler.js';
import { config } from '../../config/config.js';

const townEnterHandler = async (socket, packetData) => {
  try {
    const user = getUserSessions().getUser(socket);
    const redisSession = new RedisSession();
    if (!user)
      socket.emit(
        'error',
        new CustomError(ErrorCodes.USER_NOT_FOUND, 'getUser 에러'),
      );

    // 새 플레이어에 사용할 playerId 생성 또는 기존 ID 사용
    const playerId = socket.player.playerId;

    // DB에서 스탯 정보 로드 (playerId를 키로 사용)
    const statData = await loadStat(playerId);

    // 인벤토리 업데이트: 인벤토리 DB 데이터를 Redis에 동기화
    await updateInventory();

    // PlayerSession에 추가 및 Redis 저장
    const playerSessionManager = getPlayerSession();
    const newPlayer = await playerSessionManager.addPlayer(
      socket,
      user,
      packetData.nickname,
      packetData.classCode,
      statData, // DB에서 로드한 스탯 데이터를 전달
    );
    // console.log('newPlayer : ', newPlayer);

    // Redis에 playerSession 저장
    await redisSession.saveFullSession(socket);

    console.log(
      '----- Player Session 업데이트 및 Redis 저장 완료 -----\n',
      newPlayer,
    );

    // 서버의 타운 정보에 새 플레이어 추가
    const townSector = getSectorSessions().getSector(config.sector.town);
    newPlayer.setSectorId(config.sector.town);
    townSector.setPlayer(socket, newPlayer);

    // 타운 접속 중인 플레이어 정보 모아서 패킷 전송 (나에게 다른 플레이어 보여주기 위함)
    const players = [];
    townSector
      .getAllPlayer()
      .values()
      .forEach((player) => {
        players.push(player.getPlayerInfo());
      });

    socket.write(PACKET.S2CEnterTown(players));

    // 전체 유저에게 내 입장을 알림
    const chatPacket = PACKET.S2CChat(
      0,
      `${newPlayer.nickname}님이 입장하였습니다.`,
      'System',
    );
    getPlayerSession().notifyExceptMe(chatPacket, socket.id);

    // 타운에 있는 유저들에게 내 정보 전송할 예정 (다른 플레이어들에게 나를 보여주기 위함)
    playerSpawnNotificationHandler(socket);

    // 인벤토리 업데이트 핸들러를 호출하여 MySQL에 저장된 인벤토리 정보를 Redis에 저장하고,
    // 재구성한 후 클라이언트에 인벤토리 패킷을 전송함
    // MySQL에서 Redis로 인벤토리 데이터를 동기화
    await inventoryUpdateHandler(socket);
  } catch (error) {
    console.error(`${chalk.red('[townEnterHanlder Error]')}\n${error}`);
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'townEnterHanlder 에러'),
    );
  }
};

export default townEnterHandler;
