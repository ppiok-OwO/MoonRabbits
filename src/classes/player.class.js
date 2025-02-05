import TransformInfo from './transformInfo.class.js';
import User from './user.class.js';
import stats from './stats.class.js';
import payloadData from '../utils/packet/payloadData.js';
class Player extends User {
  constructor(socket, playerId) {
    super(socket);
    this.id = playerId;
    this.position = new TransformInfo();
    this.stat = null;
    this.class = null;
    this.dungeonId = null;
  }

  setPlayerInfo(stat = new stats(), classCode) {
    this.stat = stat;
    this.class = classCode;
  }
  getPlayerStatus() {
    return payloadData.PlayerStatus(
      this.class,
      this.stat.getLevel(),
      this.nickname,
      this.stat.getMaxHp(),
      this.stat.getMaxMp(),
      this.stat.getHp(),
      this.stat.getMp(),
    );
  }
  getStatInfo(){
    return this.stat.getPlayerStats();
  }

  setDungeonId(dungeonId) {
    this.dungeonId = dungeonId;
  }

  getDungeonId() {
    return this.dungeonId;
  }

  resetDungeonId() {
    this.dungeonId = null;
  }
}

export default Player;
