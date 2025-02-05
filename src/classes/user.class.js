class User {
  constructor(socket) {
    this.id = null;
    this.nickname = null;
    this.socket = socket;
  }

  setUserInfo(id, nickname) {
    this.id = id;
    this.nickname = nickname;
  }

  getId() {
    return this.id;
  }

  getSocket() {
    return this.socket;
  }
}

export default User;
