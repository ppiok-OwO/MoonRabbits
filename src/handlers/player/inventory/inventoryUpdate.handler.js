import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import { syncInventoryToRedisAndSend } from '../../../db/user/user.db.js';
import PACKET from '../../../utils/packet/packet.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const inventoryUpdateHandler = async (socket) => {
  try {
    // socket에 저장된 playerId 사용
    const player_id = socket.player.playerId;

    // MySQL에서 Redis로 인벤토리 데이터를 동기화
    await syncInventoryToRedisAndSend(player_id);

    // Redis에서 인벤토리 데이터를 읽어오기 (값이 없으면 빈 객체로 초기화)
    const redisKey = `inventory:${player_id}`;
    const redisData = (await redisClient.hgetall(redisKey)) || {};
    const slots = [];

    // Redis 데이터가 비어있으면 경고 로그 추가
    if (Object.keys(redisData).length === 0) {
      console.warn(
        `[InventoryHandler Log] Redis에 플레이어 ${player_id} 데이터가 존재하지 않습니다.`,
      );
    }

    // 슬롯 번호(키)를 숫자로 변환한 후 오름차순 정렬
    const keys = Object.keys(redisData)
      .map(Number)
      .sort((a, b) => a - b);

    // 각 슬롯 데이터를 검증 및 파싱 후 배열에 추가
    for (const key of keys) {
      const slotData = redisData[key.toString()];
      if (!slotData) {
        console.warn(`플레이어 ${player_id}의 슬롯 ${key} 데이터가 undefined입니다.`);
        continue;
      }
      let dataObj;
      try {
        dataObj = JSON.parse(slotData);
      } catch (err) {
        console.error(`슬롯 ${key} 데이터 파싱 에러: ${err}`);
        continue;
      }
      slots.push({
        slotIdx: key,
        itemId: +dataObj.itemId,
        stack: dataObj.stack,
      });
    }

    // Redis에서 가져온 슬롯 데이터를 payload에 담기
    const payload = slots;
    console.log(
      `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 인벤토리 Update!`,
    );

    // 패킷 생성 및 전송
    const packet = PACKET.S2CInventoryUpdate(payload);
    return socket.write(packet);
  } catch (error) {
    console.error(chalk.red('[inventoryUpdate Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'inventoryUpdate 에러'));
  }
};
