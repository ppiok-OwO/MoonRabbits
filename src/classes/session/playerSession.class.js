import Player from '../player.class.js';

class PlayerSession {
  players = new Map();
  playerId = 1;

  addPlayer(socket) {
    this.players.set(socket, new Player(socket, this.playerId++));

    const newUser = this.players.get(socket);

    return newUser;
  }

  removePlayer(socket) {
    this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }
  getPlayerById(id){
    for (const player of this.players.values()) {
      if(player.id === id)
        return player;
    }
    return -1;
  }

  getAllPlayers() {
    // return this.players.values();
    return this.players;
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
