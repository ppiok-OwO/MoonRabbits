import Player from '../player.class.js';
import { getSectorSessions } from '../../session/sessions.js';
class PlayerSession {
  players = new Map();
  playerId = 1;

  addPlayer(socket, user, nickname, classCode) {
    this.players.set(
      socket,
      new Player(user, this.playerId++, nickname, classCode),
    );
    const newPlayer = this.players.get(socket);
    getSectorSessions().getSector(1).addPlayer(socket, newPlayer);

    return newPlayer;
  }

  removePlayer(socket) {
    this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }
  getPlayerById(playerId) {
    for (const player of this.players.values()) {
      if (player.id === playerId) return player;
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
