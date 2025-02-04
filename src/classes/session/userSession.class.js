import Player from '../player.class.js';

class UserSession {
  users = new Map();
  playerId = 1;

  addUser(socket) {
    const newUser = this.users.set(socket, new Player(socket, this.playerId++));
    return newUser;
  }

  removeUser(socket) {
    this.users.delete(socket);
  }

  getUser(socket) {
    return this.users.get(socket);
  }

  getAllUsers() {
    return this.users.values();
  }

  clearSession() {
    this.users.clear();
  }

  notify() {}
}

export default UserSession;
