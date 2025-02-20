import { v4 as uuidV4 } from 'uuid';
import Dungeon from '../dungeon.class.js';

class TestDungeonSession {
  dungeons = new Map();
  players = new Map();
  sceneCode = 2;

  addPlayer(socket, player) {
    this.players.set(socket, player);
  }

  removePlayer(socket) {
    this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }

  getPlayer() {}

  getPlayerAll() {}

  notify(packet) {
    for (const player of this.players.keys()) {
      player.write(packet);
    }
  }

  setDungeon(dungeonCode) {
    const dungeonId = uuidV4();
    const newDungeon = new Dungeon(dungeonId, dungeonCode);
    this.dungeons.set(dungeonId, newDungeon);
    return newDungeon;
  }

  removeDungeon(dungeonId) {
    this.dungeons[dungeonId].players.forEach((player) =>
      player.resetDungeonId(),
    );
    this.dungeons.delete(dungeonId);
  }

  getDungeon(dungeonId) {
    return this.dungeons.get(dungeonId);
  }

  getAllDungeons() {
    return this.dungeons.values();
  }

  clearSession() {
    this.dungeons.clear();
  }
}

export default TestDungeonSession;
