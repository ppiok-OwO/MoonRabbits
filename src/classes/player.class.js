import TransformInfo from './transformInfo.class.js';
import User from './user.class.js';
import payloadData from '../utils/packet/payloadData.js';
import { config } from '../config/config.js';
import Entity from './stat.class.js';
class Player extends Entity {
  constructor(user, playerId, nickname, classCode) {
    const newplayerstat = config.newPlayerStatData.BASE_STAT_DATA[classCode];
    try {
      super(
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
    } catch (error) {
      console.error('!!! ', error);
    }
    this.class = classCode;
    this.nickname = nickname;
    this.user = user;
    this.id = playerId;
    this.position = new TransformInfo();
    this.dungeonId = null;
    this.lastBattleLog = 0;
    this.path = null;
  }
  sendPacket(packet) {
    try {
      this.user.socket.write(packet);
    } catch (error) {
      console.error(error);
    }
  }

  getPlayerStatus() {
    return payloadData.PlayerStatus(
      this.class,
      this.getLevel(),
      this.nickname,
      this.getMaxHp(),
      this.getMaxMp(),
      this.getHp(),
      this.getMp(),
    );
  }
  getPlayerStats() {
    return payloadData.StatInfo(
      this.level,
      this.hp,
      this.maxHp,
      this.mp,
      this.maxMp,
      this.atk,
      this.def,
      this.magic,
      this.speed,
    );
  }
  getPlayerInfo() {
    return payloadData.PlayerInfo(
      this.id,
      this.nickname,
      this.class,
      this.position,
      this.getPlayerStats(),
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

  getPlayerId() {
    return this.id;
  }

  resetDungeonId() {
    this.dungeonId = null;
  }

  setPath(path) {
    this.path = path;
  }

  getPath() {
    return this.path;
  }
}

export default Player;
