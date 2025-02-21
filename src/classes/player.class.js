import TransformInfo from './transformInfo.class.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { config } from '../config/config.js';
import Entity from './stat.class.js';
import { getGameAssets } from '../init/assets.js';

class Player extends Entity {
  constructor(user, playerId, nickname, classCode, statData) {
    const baseStat = statData || config.newPlayerStatData.BASE_STAT_DATA[classCode];
    try {
      super(
        PAYLOAD_DATA.StatInfo(
          baseStat.level,
          baseStat.stamina,
          baseStat.pickSpeed,
          baseStat.moveSpeed,
          baseStat.abilityPoint,
        ),
      );
    } catch (error) {}
    this.classCode = classCode;
    this.nickname = nickname;
    this.user = user;
    this.id = playerId;
    this.level = 1;
    this.position = new TransformInfo();
    this.dungeonId = null;
    this.lastBattleLog = 0;
    this.path = null;
    this.currentScene = 1;
    this.exp = (statData && statData.exp) || 0;
    this.targetExp = this._getTargetExpByLevel(this.level);
    this.abilityPoint = 0;
    this.isInParty = false;
    this.partyId = null
    this.isInvited = false;
    this.isPartyLeader = false;
    this.stamina = 100;
    this.pickSpeed = 5;
    this.moveSpeed = 10;
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
    return PAYLOAD_DATA.PlayerStatus(
      this.getLevel(),
      this.nickname,
      this.getStamina(),
      this.getPickSpeed(),
      this.getMoveSpeed(),
      this.getAbilityPoint(),
    );
  }

  getPlayerStats() {
    return PAYLOAD_DATA.StatInfo(
      this.level,
      this.stamina,
      this.pickSpeed,
      this.moveSpeed,
      this.abilityPoint,
    );
  }

  getPlayerInfo() {
    return PAYLOAD_DATA.PlayerInfo(
      this.id,
      this.nickname,
      this.level,
      this.classCode,
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
    this.abilityPoint += 3;

    return { newLevel, newTargetExp, abilityPoint:this.abilityPoint };
  }

  getTargetExp() {
    return this.targetExp;
  }

  _getTargetExpByLevel(level) {
    try {
      return getGameAssets().targetExps.data.find((targetExp) => targetExp.level === level)
        .target_exp;
    } catch (error) {
      throw new Error(`${level}lv 요구경험치 조회 오류`);
    }
  }

  addStat(statCode) {
    if(this.abilityPoint<=0) return false;
    
    this.abilityPoint--;
    switch(statCode){
      case 1: 
        this.stamina++;
        break;
      case 2:
        this.pickSpeed++;
        break;
      case 3:
        this.moveSpeed++;
        break;
      default:
        throw new Error('유효하지 않은 능력치 투자 정보');
    }
    return true;
  }

  getStatInfo() {
    return PAYLOAD_DATA.StatInfo(this.level, this.stamina, this.pickSpeed, this.moveSpeed, this.abilityPoint);
  }
}

export default Player;
