import { getPlayerSession } from '../../session/sessions.js';
import PACKET from '../packet/packet.js';
import { ErrorCodes } from './errorCodes.js';

// !!! Packet.S_Chat -> Packet.S2CChat으로 일괄 수정해씀다

const handleError = (socket, error) => {
  // const nickname = getPlayerSession().getPlayer(socket).nickname;
  const player = getPlayerSession().getPlayer(socket);
  const sectorCode = player.getSectorId();

  const nickname = '로그인 시도';

  switch (error.code) {
    case ErrorCodes.CLIENT_VERSION_MISMATCH:
      const clientVersionMismatch_sChat = PACKET.S2CChat(
        0,
        `클라이언트 버전이 일치하지 않습니다.`,
        'System',
        sectorCode,
      );
      socket.write(clientVersionMismatch_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.GAME_NOT_FOUND:
      const gameNotFound_sChat = PACKET.S2CChat(
        0,
        `게임을 찾을 수 없습니다.`,
        'System',
        sectorCode,
      );
      socket.write(gameNotFound_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.HANDLER_ERROR:
      const handerError_sChat = PACKET.S2CChat(
        0,
        `서버에서 핸들러 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(handerError_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.INVALID_PACKET:
      const invalidPacket_sChat = PACKET.S2CChat(
        0,
        `유효하지 않은 패킷입니다.`,
        'System',
        sectorCode,
      );
      socket.write(invalidPacket_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.INVALID_SEQUENCE:
      const invalidSequence_sChat = PACKET.S2CChat(
        0,
        `시퀀스 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(invalidSequence_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.MISSING_FIELDS:
      const missingFields_sChat = PACKET.S2CChat(
        0,
        `패킷에서 필드값이 누락되었습니다.`,
        'System',
        sectorCode,
      );
      socket.write(missingFields_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.NOT_ENOUGH_MONEY:
      const notEnoughMoney_sChat = PACKET.S2CChat(
        0,
        `금액이 충분하지 않습니다.`,
        'System',
        sectorCode,
      );
      socket.write(notEnoughMoney_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.PACKET_DECODE_ERROR:
      const packetDecode_sChat = PACKET.S2CChat(
        0,
        `서버에서 패킷 읽기 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(packetDecode_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.PACKET_STRUCTURE_MISMATCH:
      const packetStructureMismatch_sChat = PACKET.S2CChat(
        0,
        `서버에서 패킷 구조 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(packetStructureMismatch_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.UNKNOWN_HANDLER_ID:
      const unknownHandler_sChat = PACKET.S2CChat(
        0,
        `서버에서 핸들러 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(unknownHandler_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.USER_NOT_FOUND:
      const userNotFound_sChat = PACKET.S2CChat(
        0,
        `서버에서 사용자 조회 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(userNotFound_sChat);
      printCustomErrorConsole(nickname, error);
      break;

    case ErrorCodes.INVALID_NAVMESH:
      const invalidNavMesh_sChat = PACKET.S2CChat(
        0,
        `NavMesh 데이터가 일치하지 않습니다.`,
        'System',
        sectorCode,
      );
      socket.write(invalidNavMesh_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.PARTY_NOT_FOUND:
      const partyNotFound_sChat = PACKET.S2CChat(
        0,
        `파티 정보를 찾을 수 없습니다.`,
        'System',
        sectorCode,
      );
      socket.write(partyNotFound_sChat);
      printCustomErrorConsole(nickname, error);
      break;
    case ErrorCodes.INVALID_INPUT:
      const invalidInput = PACKET.S2CChat(
        0,
        `클라이언트에서 잘못된 값을 전송했습니다.`,
        'System',
        sectorCode,
      );
      socket.write(invalidInput);
      printCustomErrorConsole(nickname, error);
      break;
    default:
      const defaultError_sChat = PACKET.S2CChat(
        0,
        `서버에서 일반 오류가 발생하였습니다.`,
        'System',
        sectorCode,
      );
      socket.write(defaultError_sChat);

      console.error(
        '\x1b[31m-------------------- 일반 에러 발생 --------------------\x1b[0m',
      );
      console.error(
        `클라이언트: ${nickname ? `${nickname}` : `로그인하지 않음`}`,
      );
      console.error(error);
      break;
  }
};

function printCustomErrorConsole(nickname, error) {
  console.error(
    '\x1b[31m-------------------- 커스텀 에러 발생 --------------------\x1b[0m',
  );
  console.error(`클라이언트: ${nickname ? `${nickname}` : `로그인하지 않음`}`);
  console.error(error);
}

export default handleError;
