import { v4 as uuidV4 } from 'uuid';
import Dungeon from '../dungeon.class.js';

class DungeonSession {
  dungeons = new Map();

  setDungeon(dungeonCode) {
    const dungeonId = uuidV4();
    const newDungeon = new Dungeon(dungeonId, dungeonCode)
    this.dungeons.set(dungeonId, newDungeon);
    return newDungeon;
  }

  removeDungeon(dungeonId) {
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

export default DungeonSession;
