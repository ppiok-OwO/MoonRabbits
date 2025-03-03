import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import { syncInventoryToRedisAndSend } from '../../../db/user/user.db.js';
import PACKET from '../../../utils/packet/packet.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const inventoryUpdateHandler = async (socket, packetData) => {
  try {
    // socket에서 플레이어 ID 가져오기
    const player_id = socket.player.playerId;
    const redisKey = `inventory:${player_id}`;

    // Protobuf 메시지에 슬롯 업데이트 데이터가 포함되어 있는 경우
    if (packetData && packetData.slots && packetData.slots.length > 0) {
      // 클라이언트가 전달한 슬롯 이동 데이터를 기준으로 Redis 업데이트 수행
      for (const update of packetData.slots) {
        const { slotIdx, itemId, stack } = update;
        await redisClient.hset(redisKey, slotIdx, JSON.stringify({ itemId, stack }));
      }
      console.log(
        `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 슬롯 이동 업데이트 적용됨.`,
      );
    } else {
      // 슬롯 업데이트 정보가 없으면 Sector 이동에 의한 호출로 간주하여 MySQL과의 동기화를 실행
      await syncInventoryToRedisAndSend(player_id);
      console.log(
        `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 Sector 이동에 따른 동기화 수행됨.`,
      );
    }

    // Redis에 저장된 최신 인벤토리 데이터를 읽어오기
    const redisData = (await redisClient.hgetall(redisKey)) || {};
    const slots = [];

    if (Object.keys(redisData).length === 0) {
      console.warn(
        `[InventoryHandler Log] Redis에 플레이어 ${player_id}의 데이터가 존재하지 않습니다.`,
      );
    }

    // 슬롯 키를 숫자로 변환 후 오름차순 정렬
    const keys = Object.keys(redisData)
      .map(Number)
      .sort((a, b) => a - b);

    // 각 슬롯 데이터를 파싱하여 슬롯 배열에 추가
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

    console.log(
      `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 인벤토리 Update 완료.`,
    );
    // 패킷 생성 후 클라이언트에 전송
    const packet = PACKET.S2CInventoryUpdate(slots);
    return socket.write(packet);
  } catch (error) {
    console.error(chalk.red('[inventoryUpdate Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'inventoryUpdate 에러'));
  }
};

export default inventoryUpdateHandler;
