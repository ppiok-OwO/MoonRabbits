import { v4 as uuidv4 } from 'uuid';

class Party {
  members = new Map();

  // 생성하는 플레이어가 자동으로 파티장이 된다.
  constructor(socket, player) {
    this.partyLeader = player;
    this.members.set(socket, player);
    this.id = uuidv4();
  }

  addMember(socket, player) {
    // 플레이어 인스턴스를 인자로 받아오기
    this.members.set(socket, player);
    const newMember = this.members.get(socket);

    return newMember;
  }

  removeMember(plyaerId) {
    const socket = this.getSocketById(plyaerId);
    this.members.delete(socket);
  }

  getId() {
    return this.id;
  }

  getMember(socket) {
    return this.members.get(socket);
  }

  setPartyLeader(player) {
    // 파티장을 바꾸고 싶을 때
    this.partyLeader = player;
  }

  getPartyLeader() {
    return this.partyLeader;
  }

  getPartyLeaderId() {
    return this.partyLeader.id;
  }

  getAllMembersSockets() {
    return this.members.keys();
  }

  getAllMembers() {
    return this.members.values();
  }

  getAllMemberEntries() {
    return this.members.entries();
  }

  getAllMemberIds() {
    const memberIds = [];
    for (const member of this.members.values()) {
      const memberId = member.id;
      memberIds.push(memberId);
    }

    return memberIds;
  }

  getAllMemberCardInfo(playerId) {
    const memberCardInfos = [];
    for (const member of this.members.values()) {
      const memberInfo = {
        id: member.id,
        nickname: member.nickname,
        isPartyLeader: member === this.partyLeader,
        isMine: member.id === playerId,
      };

      memberCardInfos.push(memberInfo);
    }

    return memberCardInfos;
  }

  getPartyInfo() {
    return {
      partyId: this.getId(),
      leaderId: this.getPartyLeaderId(),
      memberCount: this.getMemberCount(),
    };
  }

  disbandParty() {
    this.members.clear();
    this.partyLeader = null;
  }

  getPlayerInfoOfMembers() {
    const playerInfoOfMembers = [];
    for (const member of this.members.values()) {
      const memberInfo = member.getPlayerInfo();
      playerInfoOfMembers.push(memberInfo);
    }

    return playerInfoOfMembers;
  }

  getSocketById(playerId) {
    for (const member of this.members.values()) {
      if (member.id === playerId) {
        return member.user.getSocket();
      }
    }
    return -1;
  }

  getMemberCount() {
    return this.members.size;
  }

  notify(packet) {
    for (const member of this.members.keys()) {
      member.write(packet);
    }
  }
}

export default Party;
