class Party {
  members = new Map();

  // 생성하는 플레이어가 자동으로 파티장이 된다.
  constructor(socket, player) {
    this.partyLeader = player;
    this.members.set(socket, player);
  }

  addMember(socket, player) {
    // 플레이어 인스턴스를 인자로 받아오기
    this.members.set(socket, player);
    const newMember = this.members.get(socket);

    return newMember;
  }

  removeMember(socket) {
    this.members.delete(socket);
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

  getAllMembers() {
    return this.members;
  }

  getAllMemberIds() {
    const memberIds = [];
    for (const member of this.members.values()) {
      const memberId = member.getId();
      memberIds.push(memberId);
    }

    return memberIds;
  }

  disbandParty() {
    this.members.clear();
    this.partyLeaderId = null;
  }

  getPlayerInfoOfMembers() {
    const playerInfoOfMembers = [];
    for (const member of this.members.values()) {
      const memberInfo = member.getPlayerInfo();
      playerInfoOfMembers.push(memberInfo);
    }

    return playerInfoOfMembers;
  }

  notify(packet) {
    for (const member of this.members.keys()) {
      member.write(packet);
    }
  }
}

export default Party;
