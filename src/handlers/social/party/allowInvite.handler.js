import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import {
  sessionQueue,
  sessionQueueEvents,
} from '../../../utils/bullMQ/settings.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const allowInviteHandler = async (socket, packetData) => {
  try {
    const { partyId, memberId } = packetData;

    // 파티 인스턴스
    const partySession = getPartySessions();
    const party = partySession.getParty(partyId);
    if (!party) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.PARTY_NOT_FOUND,
          '파티 정보를 찾을 수 없습니다.',
        ),
      );
    }

    // 새로운 멤버의 플레이어 인스턴스
    const playerSession = getPlayerSession();
    const newMember = playerSession.getPlayer(socket);
    if (!newMember || newMember === -1) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    const memberCount = party.getMemberCount();

    if (newMember && newMember !== -1 && memberCount < config.party.MaxMember) {
      const partyLeaderId = party.getPartyLeaderId();

      // 파티 가입 요청 job으로 추가
      const joinPartyJob = await sessionQueue.add('joinParty', {
        partyId,
        partyLeaderId,
        memberCount,
        socketId: socket.id,
      });
      console.log(`updatePartyJob ${joinPartyJob.id}가 추가되었습니다.`);

      // const partySession = getPartySessions();
      // const party = partySession.getParty(partyId);

      // // 새 플레이어를 파티에 추가
      // party.addMember(socket, newMember);
      // newMember.setPartyId(partyId);
      // newMember.isInvited = false;

      // // 플레이어 데이터 업데이트
      // const updatePlayerJob = await sessionQueue.add('updatePlayer', {
      //   socketId,
      //   isLeader: false,
      //   partyId,
      // });
      // console.log(`updatePlayerJob ${updatePlayerJob.id}가 추가되었습니다.`);

      // // 각 멤버에 대하여 맞춤형 패킷 생성
      // const members = party.getAllMembers();

      // members.forEach((value, key) => {
      //   const packet = PACKET.S2CJoinParty(
      //     partyId,
      //     partyLeaderId,
      //     memberCount,
      //     party.getAllMemberCardInfo(value.id),
      //   );
      //   key.write(packet);
      // });
    } else {
      const packet = PACKET.S2CChat(
        0,
        '해당 파티는 정원이 모두 찼으므로 참가할 수 없습니다.',
        'System',
      );

      return socket.write(packet);
    }
  } catch (error) {
    handleError(socket, error);
  }
};
