import Player from '../player.class.js';

class PlayerSession {
  players = new Map();
  playerId = 1;

  addPlayer(socket, user, nickname, classCode) {
    this.players.set(
      socket,
      new Player(user, this.playerId++, nickname, classCode),
    );

    const newPlayer = this.players.get(socket);

    return newPlayer;
  }

  removePlayer(socket) {
    this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }
  getPlayerById(id) {
    for (const player of this.players.values()) {
      if (player.id === id) return player;
    }
    return -1;
  }

  getAllPlayers() {
    // return this.players.values();
    return this.players;
  }

  getPlayerByNickname(nickname) {
    for (const player of this.players.values()) {
      if (player.nickname === nickname) {
        return player;
      }
    }
    return -1;
  }

  clearSession() {
    this.players.clear();
  }

  notify(packet) {
    for (const player of this.players.keys()) {
      player.write(packet);
    }
  }
}

export default PlayerSession;
