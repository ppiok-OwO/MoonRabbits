import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import redisClient from '../../../utils/redis/redis.config.js';
import { getGameAssets } from '../../../init/assets.js';

export const itemDisassemblyHandler = async (socket, packetData) => {
  try {
    const { slotIdx, itemId } = packetData;

    const player_id = socket.player.playerId;

    console.log(
      `playerID ${player_id}가 ${slotIdx}에 있는 ${itemId} 분해를 요청했습니다.`,
    );

    // assets 폴더에서 item_disassembly.json 파일 로드
    const assets = getGameAssets();
    const recipes = assets.item_disassembly;

    // 전달받은 itemId에 맞는 분해 레시피 검색 (JSON 데이터가 배열 형태라고 가정)
    const recipe = recipes.find((r) => r.itemId === itemId);
    if (!recipe) {
      console.error(`${itemId}은(는) 분해할 수 없습니다.`);
      return;
    }

    // Redis에서 해당 유저 인벤토리 해시 키
    const redisKey = `inventory:${userId}`;

    // 원본 아이템 제거: 해당 슬롯에서 삭제
    await redisClient.hdel(redisKey, slotIdx.toString());
    console.log(`${slotIdx}에서 분해한 아이템이 삭제됩니다.`);

    // 레시피에 정의된 분해 결과 아이템들을 순차적으로 저장
    // recipe.resultItems는 [{ itemId, stack }, ...] 형태로 구성되어 있다고 가정
    for (const resultItem of recipe.resultItems) {
      // 인벤토리의 다음 사용 가능한 슬롯 번호를 구하는 헬퍼 함수 호출
      const freeSlot = await getFreeSlotIndex(redisKey);
      // Redis 해시에 새 아이템 정보 저장 (문자열 직렬화)
      await redisClient.hset(
        redisKey,
        freeSlot.toString(),
        JSON.stringify({
          itemId: resultItem.itemId,
          stack: resultItem.stack,
        }),
      );
      console.log(
        `분해한 아이템 ${resultItem.itemId}의 ${resultItem.stack})개가 ${freeSlot}번 슬롯에 배치됩니다.`,
      );
    }
  } catch (error) {
    console.error(chalk.red('[itemObtainedHandler Error]\n', error));
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'itemObtainedhandler 에러'),
    );
  }
};

// 인벤토리 Redis 해시에서 사용 가능한 (비어 있는) 슬롯 번호를 찾는 헬퍼 함수
async function getFreeSlotIndex(redisKey) {
  const keys = await redisClient.hkeys(redisKey);
  // 기존 슬롯 번호들을 숫자로 변환 후 오름차순 정렬
  const indices = keys.map((key) => parseInt(key, 10)).sort((a, b) => a - b);
  let freeIndex = 0;
  for (const index of indices) {
    if (index === freeIndex) {
      freeIndex++;
    } else {
      break;
    }
  }
  return freeIndex;
}

export default itemDisassemblyHandler;
