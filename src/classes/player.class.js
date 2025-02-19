import TransformInfo from './transformInfo.class.js';
import User from './user.class.js';
import payloadData from '../utils/packet/payloadData.js';
import makePacket from '../utils/packet/makePacket.js';
import { config } from '../config/config.js';
import Entity from './stat.class.js';
import { getGameAssets } from '../init/assets.js';
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
    this.level = 1;
    this.position = new TransformInfo();
    this.dungeonId = null;
    this.lastBattleLog = 0;
    this.path = null;
    this.currentScene = null;
    this.exp = 0;
    this.targetExp = this._getTargetExpByLevel(this.level);
    this.availablePoint = 0;
    this.isInParty = false;
    this.isInvited = false;
    this.isPartyLeader = false;
  }
  sendPacket(packet) {
    try {
      this.user.socket.write(packet);
    } catch (error) {
      console.error(error);
    }
  }

  setCurrentScene(sceneCode) {
    this.currentScene = sceneCode;
  }

  getCurrentScene() {
    return this.currentScene;
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
      this.level,
      this.class,
      this.position,
      this.getPlayerStats(),
      this.getCurrentScene(),
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

  getExp() {
    return this.exp;
  }

  setExp(exp) {
    this.exp = exp;
    return this.exp;
  }

  getLevel() {
    return this.level;
  }

  levelUp() {
    // 레벨 변경
    const newLevel = this.level + 1;
    this.level = newLevel;

    // 요구 경험치 변경
    const newTargetExp = this._getTargetExpByLevel(newLevel);
    this.targetExp = newTargetExp;

    // 레벨업하면 올릴 수 있는 능력치 개수
    const availablePoint = 3;
    this.availablePoint = availablePoint;

    return { newLevel, newTargetExp, availablePoint };
  }

  getTargetExp() {
    return this.targetExp;
  }

  _getTargetExpByLevel(level) {
    try {
      return getGameAssets().targetExps.data.find(
        (targetExp) => targetExp.level === level,
      ).target_exp;
    } catch (error) {
      throw new Error(`${level}lv 요구경험치 조회 오류`);
    }
  }

  addStat(statCode, point) {}
}

export default Player;
