import Player from '../player.class.js';

class PlayerSession {
  players = new Map();
  playerId = 1;

  addPlayer(socket) {
    const newUser = this.players.set(
      socket,
      new Player(socket, this.playerId++),
    );
    return newUser;
  }

  removePlayer(socket) {
    this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }

  getAllPlayers() {
    return this.players.values();
  }

  clearSession() {
    this.players.clear();
  }

  notify(packet) {
    for (const user of this.players) {
      user.socket.write(packet);
    }
  }
}

export default PlayerSession;
