import chalk from 'chalk';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import { saveHousingData } from '../../db/user/user.db.js';

export const housingSaveHandler = async (socket, packetData) => {
  try {
    // socket 객체에서 playerId 추출 (예: socket.user.playerId라 가정)
    const playerId = socket.player.playerId;
    if (!playerId) {
      throw new Error('플레이어 ID가 존재하지 않습니다.');
    }

    // protobuf C2SHousingSave 의 필드: housingInfo (반복 배열)
    const { housingInfo } = packetData;
    if (!Array.isArray(housingInfo)) {
      throw new Error('housingInfo 필드는 배열이어야 합니다.');
    }

    // 각 HousingInfo 객체의 데이터 형식 검증 (itemId, dataType, transform 필드 포함 여부 및 좌표 값 타입)
    for (const info of housingInfo) {
      // itemId와 dataType은 반드시 숫자여야 하므로 먼저 검증합니다.
      if (typeof info.itemId !== 'number' || typeof info.dataType !== 'number') {
        throw new Error('housingInfo 객체의 형식이 올바르지 않습니다.');
      }

      // transform 객체가 존재하지 않으면 빈 객체로 할당하고 기본값 적용
      const transform = info.transform || {};

      // 디스트럭처링 기본값 제공
      const { posX = 0, posY = 0, posZ = 0, rot = 0 } = transform;

      // 각 값들이 숫자인지 확인 (필요에 따라 숫자 변환 처리도 가능)
      if ([posX, posY, posZ, rot].some((val) => typeof val !== 'number')) {
        throw new Error('transform 내 좌표 값에 숫자가 아닌 값이 포함되어 있습니다.');
      }

      // 필요시 info.transform에 기본값 적용된 값을 갱신
      info.transform = { posX, posY, posZ, rot };
    }

    console.log('housingInfo : \n', housingInfo);
    // DB에 가구 배치 데이터를 저장 (saveHousingData 함수는 이전에 정의한 DB 저장 로직 사용)
    await saveHousingData(playerId, housingInfo);

    // 저장 완료 후 클라이언트에 성공 응답 전송
    const responsePacket = PACKET.S2CHousingSave('success', '가구 배치 저장 완료');
    socket.write(responsePacket);
    console.log(chalk.green(`[housingSaveHandler] 가구 배치 저장 완료 - playerId: ${playerId}`));
  } catch (error) {
    console.error(chalk.red('[housingSaveHandler Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'housingSaveHandler 에러'));
  }
};

export default housingSaveHandler;
