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
    this.lastBattleLog = 0;
  }

  setNewPlayerInfo(classCode, nickname) {
    const newplayerstat = config.newPlayerStatData.baseStatData[classCode];
    this.stat = new stats(
      payloadData.StatInfo(
        newplayerstat.level,
        newplayerstat.hp,
        newplayerstat.maxHp,
        newplayerstat.mp,
        newplayerstat.maxMp,
        newplayerstat.atk,
        newplayerstat.def,
        newplayerstat.magic,
        newplayerstat.speed,
      ),
    );
    this.class = classCode;
    this.nickname = nickname;
  }
  sendPacket(packet) {
    this.socket.write(packet);
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
  getStatInfo() {
    return this.stat.getPlayerStats();
  }
  getPlayerInfo() {
    return payloadData.PlayerInfo(
      this.id,
      this.nickname,
      this.class,
      this.position,
      this.getStatInfo(),
    );
  }

  setDungeonId(dungeonId) {
    this.dungeonId = dungeonId;
  }

  getDungeonId() {
    return this.dungeonId;
  }
  getPlayerStat() {
    return this.stat;
  }

  resetDungeonId() {
    this.dungeonId = null;
  }
}

export default Player;
