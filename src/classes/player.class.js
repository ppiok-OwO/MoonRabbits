import TransformInfo from './transformInfo.class.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { config } from '../config/config.js';
import { getGameAssets } from '../init/assets.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

class Player {
  constructor(user, playerId, nickname, classCode, statData, sectorId = 100) {
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
    this.targetExp = this._getTargetExpByLevel(this.level).targetExp;
    this.abilityPoint = baseStat.ability_point;
    this.partyId = null;
    this.isInvited = false;
    this.gatheringIdx = 0;
    this.gatheringAngle = 180;
    this.gatheringStartTime = 0;
    this.gatheringSuccess = false;
    this.stamina = baseStat.stamina;
    this.hp = config.newPlayerStatData.hp;
    this.pickSpeed = baseStat.pick_speed;
    this.moveSpeed = baseStat.move_speed;
    this.currentEquip = 0;
    this.isCrafting = false;
    this.craftingSlots = [];
  }

  sendPacket(packet) {
    try {
      const socket = this.user.getSocket();
      return socket.write(packet);
    } catch (error) {
      console.error(error);
    }
  }

  setHp(num) {
    this.hp = num;
    if (this.hp < 0) {
      this.hp = 0;
    }

    return this.hp;
  }

  getHp() {
    return this.hp;
  }

  getStamina() {
    return this.stamina;
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
      this.stamina,
      this.exp,
      this.targetExp,
      this.hp,
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
    );
  }
  getPosition() {
    return {
      x: this.position.posX,
      y: this.position.posY,
      z: this.position.posZ,
    };
  }

  setSectorId(sectorId) {
    return (this.currentSector = sectorId);
  }
  setAngle(angle) {
    this.gatheringStartTime = Date.now();
    return (this.gatheringAngle = angle);
  }
  setGatheringIdx(idx) {
    return (this.gatheringIdx = idx);
  }
  getGatheringIdx() {
    return this.gatheringIdx;
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
  setPosition(info) {
    this.position = info;
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
    const { newLevel, newTargetExp } = this._getTargetExpByLevel(this.level);

    // 만렙이면 level만 올리고 요구 경험치 2배로
    if (newLevel === -1) {
      this.level += 1;
      this.targetExp *= 2;
      this.abilityPoint += 3;
      return {
        newLevel: this.level,
        newTargetExp: this.targetExp,
        abilityPoint: this.abilityPoint,
      };
    }

    // 레벨, 요구 경험치 변경
    this.level = newLevel;
    this.targetExp = newTargetExp;

    // 레벨업하면 올릴 수 있는 능력치 개수
    this.abilityPoint += 3;

    return { newLevel, newTargetExp, abilityPoint: this.abilityPoint };
  }

  setCurrentEquip(equipment) {
    if (equipment > 2 || equipment < 0) return;

    this.currentEquip = equipment;
  }

  getCurrentEquip() {
    return this.currentEquip;
  }

  getTargetExp() {
    return this.targetExp;
  }

  _getTargetExpByLevel(level) {
    try {
      const data = getGameAssets().targetExps.data.find(
        (target) => target.level === level,
      );
      return { targetLevel: data.targetLevel, targetExp: data.target_exp };
    } catch (error) {
      socket.emit(
        new CustomError(
          ErrorCodes.MISSING_FIELDS,
          `${level}lv 요구경험치 조회 오류`,
        ),
      );
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
      this.stamina,
      this.exp,
      this.targetExp,
      this.hp,
    );
  }

  setStatInfo(statInfo) {
    this.level = statInfo.level;
    this.exp = statInfo.exp;
    this.stamina = statInfo.stamina;
    this.pickSpeed = statInfo.pickSpeed;
    this.moveSpeed = statInfo.moveSpeed;
    this.abilityPoint = statInfo.abilityPoint;
    this.targetExp = statInfo.targetExp;
    this.hp = statInfo.hp;
  }

  backupCraftingSlot(slotIdx, itemId, stack) {
    this.craftingSlots.push({ slotIdx, itemId, stack });
  }
}

export default Player;
