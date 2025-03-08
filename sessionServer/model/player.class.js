class Player {
  constructor(serverIP, socketId, nickname, isLeader = false, partyId = null) {
    this.serverIP = serverIP;
    this.socketId = socketId;
    this.nickname = nickname;
    this.isLeader = isLeader;
    this.partyId = partyId;
  }

  getServerIP() {
    return this.serverIP;
  }

  setServerIP(serverIP) {
    this.serverIP = serverIP;
  }

  getSocketId() {
    return this.socketId;
  }

  setSocketId(socketId) {
    this.socketId = socketId;
  }

  getNickname() {
    return this.nickname;
  }

  setNickname(nickname) {
    this.nickname = nickname;
  }

  getIsLeader() {
    return this.isLeader;
  }

  setIsLeader(isLeader) {
    this.isLeader = isLeader;
  }

  getPartyId() {
    return this.partyId;
  }

  setPartyId(partyId) {
    this.partyId = partyId;
  }
}
