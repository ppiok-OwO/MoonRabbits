import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import Packet from '../../../utils/packet/packet.js';

export const inviteParty = (socket, packetData) => {
  try {
    const { partyId, nickname } = packetData;

    const partySession = getPartySessions();
    const party = partySession.getParty(partyId);

    const playerSession = getPlayerSession();
    const newMember = playerSession.getPlayerByNickname(nickname);

    if (party.getMemberCount < config.party.MaxMember) {
      party.addMember(socket, newMember);
    }

    const packet = Packet.S2CInviteParty(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberIds(),
    );

    party.notify(packet);
  } catch (error) {
    handleError(socket, error);
  }
};
