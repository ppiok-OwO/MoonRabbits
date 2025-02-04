import TransformInfo from './transformInfo.class.js';
import User from './user.class.js';

class Player extends User {
  constructor(socket, playerId) {
    super(socket);
    this.id = playerId;
    this.position = new TransformInfo();
    this.level = null;
    this.stat = null;
    this.class = null;
    this.dungeonId = null;
  }

  setPlayerInfo(level, stat, classCode) {
    this.level = level;
    this.stat = stat;
    this.class = classCode;
  }

  setDungeonId(dungeonId) {
    this.dungeonId = dungeonId;
  }

  resetDungeonId() {
    this.dungeonId = null;
  }
}

export default Player;
