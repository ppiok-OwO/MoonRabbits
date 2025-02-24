import TransformInfo from './transformInfo.class.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { config } from '../config/config.js';
import { getGameAssets } from '../init/assets.js';

class Player {
  constructor(user, playerId, nickname, classCode, statData, sectorId = 1) {
    const baseStat = statData;
    this.classCode = classCode;
    this.nickname = nickname;
    this.user = user;
    this.id = playerId;
    this.level = baseStat.level;
    this.position = new TransformInfo();
    this.currentSector = sectorId;
    this.lastBattleLog = 0;
    this.path = null;
    this.exp = (statData && statData.exp) || 0;
    this.targetExp = this._getTargetExpByLevel(this.level);
    this.abilityPoint = baseStat.ability_point;
    this.isInParty = false;
    this.isPartyLeader = false;
    this.partyId = null;
    this.isInvited = false;
    this.gatheringAngle = 180;
    this.gatheringStartTime = 0;
    this.stamina = baseStat.stamina;
    this.pickSpeed = baseStat.pick_speed;
    this.moveSpeed = baseStat.move_speed;
  }

  sendPacket(packet) {
    try {
      const socket = this.user.getSocket();
      return socket.write(packet);
    } catch (error) {
      console.error(error);
    }
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
      this.currentSector,
    );
  }

  setSectorId(sectorId) {
    return (this.currentSector = sectorId);
  }
  setAngle(angle) {
    this.gatheringStartTime = Date.now();
    return (this.gatheringAngle = angle);
  }
  setPartyId(partyId) {
    this.partyId = partyId;
  }

  getPartyId() {
    return this.partyId;
  }

  getSectorId() {
    return this.currentSector;
  }

  getPlayerStat() {
    return this.stat;
  }

  getPlayerId() {
    return this.id;
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

  getPickSpeed() {
    return this.pickSpeed;
  }

  getMoveSpeed() {
    return this.moveSpeed;
  }

  getAbilityPoint() {
    return this.abilityPoint;
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

    return { newLevel, newTargetExp, abilityPoint: this.abilityPoint };
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

  addStat(statCode) {
    if (this.abilityPoint <= 0) return false;

    this.abilityPoint--;
    switch (statCode) {
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
    return PAYLOAD_DATA.StatInfo(
      this.level,
      this.stamina,
      this.pickSpeed,
      this.moveSpeed,
      this.abilityPoint,
    );
  }
}

export default Player;
