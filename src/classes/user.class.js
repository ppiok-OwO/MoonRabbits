class User {
  constructor(socket) {
    this.nickname = null;
    this.socket = socket;
  }

  getSocket() {
    return this.socket;
  }
}

export default User;
