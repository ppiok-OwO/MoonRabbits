import chalk from 'chalk';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { loadHousingData } from '../user.db.js';

export const housingLoadHandler = async (socket, packetData) => {
  try {
    // socket 객체에서 플레이어 ID 추출
    const playerId = socket.player.playerId;
    if (!playerId) {
      throw new Error('플레이어 ID가 존재하지 않습니다.');
    }

    // DB에서 해당 플레이어의 가구 배치 데이터를 조회
    const housingInfos = await loadHousingData(playerId);

    // 클라이언트로 조회된 데이터를 포함해 응답 전송
    const responsePacket = PACKET.S2CHousingLoad(
      'success',
      '가구 배치 불러오기 성공',
      housingInfos,
    );
    socket.emit(responsePacket);
    console.log(
      chalk.green(
        `[housingLoadHandler] 가구 배치 불러오기 성공 - playerId: ${playerId}`,
      ),
    );
  } catch (error) {
    console.error(chalk.red('[housingLoadHandler Error]\n', error));
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'housingLoadHandler 에러'),
    );
  }
};

export default housingLoadHandler;
