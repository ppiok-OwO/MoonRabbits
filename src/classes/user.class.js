class User {
  constructor(nickname, socket) {
    this.id = null;
    this.nickname = nickname;
    this.socket = socket;
  }

  setUserInfo(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getSocket() {
    return this.socket;
  }
}

export default User;
