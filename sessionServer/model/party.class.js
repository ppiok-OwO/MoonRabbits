class Party {
  constructor(partyId, partyLeaderId, memberCount, serverIP) {
    this.partyId = partyId;
    this.partyLeaderId = partyLeaderId;
    this.memberCount = memberCount;
    this.serverIP = serverIP;
  }

  getPartyId() {
    return this.partyId;
  }

  setPartyId(partyId) {
    this.partyId = partyId;
  }

  getPartyLeaderId() {
    return this.partyLeaderId;
  }

  setPartyLeaderId(partyLeaderId) {
    this.partyLeaderId = partyLeaderId;
  }

  getMemberCount() {
    return this.memberCount;
  }

  setMemberCount(memberCount) {
    this.memberCount = memberCount;
  }

  getServerIP() {
    return this.serverIP;
  }

  setServerIP(serverIP) {
    this.serverIP = serverIP;
  }
}
