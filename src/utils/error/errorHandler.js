import { config } from '../../config/config.js';
import { getPlayerSession } from '../../session/sessions.js';
import makePacket from '../packet/makePacket.js';
import payload from '../packet/payload.js';
import { ErrorCodes } from './errorCodes.js';

const handleError = (socket, error) => {
  let errorPacketId;
  let errorReponsePayload;
  let errorReponsePacket;
  let errorReponseCode;
  
  const playerId = getPlayerSession().getPlayer(socket).id;
  const nickname = getPlayerSession().getPlayer(socket).nickname;

  switch (error.code) {
    case ErrorCodes.CLIENT_VERSION_MISMATCH:
    case ErrorCodes.GAME_NOT_FOUND:
    case ErrorCodes.INVALID_PACKET:
    case ErrorCodes.INVALID_SEQUENCE:
    case ErrorCodes.MISSING_FIELDS:
    case ErrorCodes.NOT_ENOUGH_MONEY:
    case ErrorCodes.PACKET_DECODE_ERROR:
    case ErrorCodes.PACKET_STRUCTURE_MISMATCH:
    case ErrorCodes.UNKNOWN_HANDLER_ID:
    case ErrorCodes.USER_NOT_FOUND:
      console.error('\x1b[31m-------------------- 커스텀 에러 발생 --------------------\x1b[0m');
      console.error(`클라이언트: ${playerId} (${nickname?`${nickname}`:`로그인하지 않음`})`);
      console.error(error);
      break;
    default:
      console.error('\x1b[31m-------------------- 일반 에러 발생 --------------------\x1b[0m');
      console.error(`클라이언트: ${playerId} (${nickname?`${nickname}`:`로그인하지 않음`})`);
      console.error(error);
      break;
  }
  // 에러 타입에 따라 클라이언트에 데이터를 보내려면 필요
  // errorReponsePayload = payload.S_Chat(-1, `서버에서 오류가 발생하였습니다. ${error.name}`);
  // errorReponsePacket = makePacket(config.packetId.S_Chat, errorReponsePayload);
  // socket.write(errorReponsePacket);
};

export default handleError;
