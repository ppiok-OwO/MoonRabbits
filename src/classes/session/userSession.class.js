import { v4 as uuidV4 } from 'uuid';
import User from '../user.class.js';

class UserSession {
  users = new Map();

  setUser(socket) {
    const newUser = new User(socket);

    this.users.set(socket, newUser);
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
}

export default UserSession;
