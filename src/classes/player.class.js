import TransformInfo from './transformInfo.class.js';
import User from './user.class.js';
import stats from './stats.class.js';
import payloadData from '../utils/packet/payloadData.js';
import { config } from '../config/config.js';
class Player extends User {
  constructor(socket, playerId) {
    super(socket);
    this.id = playerId;
    this.position = new TransformInfo();
    this.stat = null;
    this.class = null;
    this.dungeonId = null;
  }

  setNewPlayerInfo(classCode) {
    const newplayerstat = config.newPlayerStatData.baseStatData[classCode];
    this.stat = new stats(payloadData.StatInfo(
      newplayerstat.level,
      newplayerstat.hp,
      newplayerstat.maxHp,
      newplayerstat.mp,
      newplayerstat.maxMp,
      newplayerstat.atk,
      newplayerstat.def,
      newplayerstat.magic,
      newplayerstat.speed,
    ));
    this.class = classCode;
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
