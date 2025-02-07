import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../packet/packet.js';
import { ErrorCodes } from './errorCodes.js';

const handleError = (socket, error) => {
  const nickname = getPlayerSession().getPlayer(socket).nickname;

  switch (error.code) {
    case ErrorCodes.CLIENT_VERSION_MISMATCH:
      const clientVersionMismatch_sChat = Packet.S_Chat(0, `클라이언트 버전이 일치하지 않습니다.`);
      socket.write(clientVersionMismatch_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.GAME_NOT_FOUND:
      const gameNotFound_sChat = Packet.S_Chat(0, `게임을 찾을 수 없습니다.`);
      socket.write(gameNotFound_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.HANDLER_ERROR:
      const handerError_sChat = Packet.S_Chat(0, `서버에서 핸들러 오류가 발생하였습니다.`);
      socket.write(handerError_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.INVALID_PACKET:
      const invalidPacket_sChat = Packet.S_Chat(0, `유효하지 않은 패킷입니다.`);
      socket.write(invalidPacket_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.INVALID_SEQUENCE:
      const invalidSequence_sChat = Packet.S_Chat(0, `시퀀스 오류가 발생하였습니다.`);
      socket.write(invalidSequence_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.MISSING_FIELDS:
      const missingFields_sChat = Packet.S_Chat(0, `패킷에서 필드값이 누락되었습니다.`);
      socket.write(missingFields_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.NOT_ENOUGH_MONEY:
      const notEnoughMoney_sChat = Packet.S_Chat(0, `금액이 충분하지 않습니다.`);
      socket.write(notEnoughMoney_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.PACKET_DECODE_ERROR:
      const packetDecode_sChat = Packet.S_Chat(0, `서버에서 패킷 읽기 오류가 발생하였습니다.`);
      socket.write(packetDecode_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.PACKET_STRUCTURE_MISMATCH:
      const packetStructureMismatch_sChat = Packet.S_Chat(0, `서버에서 패킷 구조 오류가 발생하였습니다.`);
      socket.write(packetStructureMismatch_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.UNKNOWN_HANDLER_ID:
      const unknownHandler_sChat = Packet.S_Chat(0, `서버에서 핸들러 오류가 발생하였습니다.`);
      socket.write(unknownHandler_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.USER_NOT_FOUND:
      const userNotFound_sChat = Packet.S_Chat(0, `서버에서 사용자 조회 오류가 발생하였습니다.`);
      socket.write(userNotFound_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    default:
      const defaultError_sChat = Packet.S_Chat(0, `서버에서 일반 오류가 발생하였습니다.`);
      socket.write(defaultError_sChat);
      
      console.error('\x1b[31m-------------------- 일반 에러 발생 --------------------\x1b[0m');
      console.error(`클라이언트: ${nickname?`${nickname}`:`로그인하지 않음`}`);
      console.error(error);
      break;
  }
};

function printCustomErrorConsole(nickname, error){
  console.error('\x1b[31m-------------------- 커스텀 에러 발생 --------------------\x1b[0m');
  console.error(`클라이언트: ${nickname?`${nickname}`:`로그인하지 않음`}`);
  console.error(error);
}

export default handleError;
