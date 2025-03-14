//몬스터, 플레이어 통합 관리용 클래스스
class Entity {
  constructor(stat = payloadData.StatInfo(1, 100, 5, 1, 0)) {
    const { level, stamina, pickSpeed, moveSpeed, abilityPoint } = stat;
    this.level = level;
    this.stamina = stamina;
    this.pickSpeed = pickSpeed;
    this.moveSpeed = moveSpeed;
    this.abilityPoint = abilityPoint;

    this.effectLevel = 0;
    this.effectMaxHp = 0;
    this.effectMaxMp = 0;
    this.effectAtk = 0;
    this.effectDef = 0;
    this.effectMagic = 0;
    this.effectSpeed = 0;

    // 현제 계획 없음
    //원하는 구조(회의필요) : 부정적인 효과는 - 긍정적 효과는 +으로 표현 각 효과마다 , 로 구분 효과와 정도를 q로 구분
    // ex) 만약 최대체력 가감이 5로 지정된 경우
    // ,-5q50 (최대체력 50 감소)
    this.effects = null;
  }
  getEffects() {
    return this.effects;
  }
  setEffects(effects) {
    this.effects = effects;
    reCalEffect();
  }
  addEffects(effect) {
    this.effects += effect;
    reCalEffect();
  }
  //변경된 이펙트에 따른 변경점
  reCalEffect() {
    this.effectLevel = 0;
    this.effectMaxHp = 0;
    this.effectMaxMp = 0;
    this.effectAtk = 0;
    this.effectDef = 0;
    this.effectMagic = 0;
    this.effectSpeed = 0;
    this.effects.split(',').forEach((effect) => {
      effectData = effect.split('q');
      switch (effectData[0]) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        default:
      }
    });
  }

  getLevel() {
    return this.level + this.effectLevel;
  }

  getExp() {
    return this.exp;
  }

  getStamina() {
    return this.stamina;
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

  getHp() {
    return this.hp;
  }
  getMaxHp() {
    return this.maxHp + this.effectMaxHp;
  }
  getMp() {
    return this.mp;
  }
  getMaxMp() {
    return this.maxMp + this.effectMaxMp;
  }
  getAtk() {
    return this.atk + this.effectAtk;
  }
  getDef() {
    return this.def + this.effectDef;
  }
  getMagic() {
    return this.magic + this.effectMagic;
  }
  getSpeed() {
    return this.speed + this.effectSpeed;
  }
  getTurn() {
    return this.turn;
  }

  setLevel(level) {
    if (level < 0) return -1;
    this.level = level;
  }
  setHp(hp) {
    if (hp < 0 || hp > this.maxHp) return -1;
    this.hp = hp;
  }
  setMaxHp(maxHp) {
    if (maxHp < 0) return -1;
    return (this.maxHp = maxHp);
  }
  setMp(mp) {
    if (mp < 0 || mp > this.maxMp) return -1;
    return (this.mp = mp);
  }
  setMaxMp(maxMp) {
    if (maxMp < 0) return -1;
    return (this.maxMp = maxMp);
  }
  setAtk(atk) {
    if (atk < 0) return -1;
    return (this.atk = atk);
  }
  setDef(def) {
    if (def < 0) return -1;
    return (this.def = def);
  }
  setMagic(magic) {
    if (magic < 0) return -1;
    return (this.magic = magic);
  }
  setSpeed(speed) {
    if (speed < 0) return -1;

    return (this.speed = speed);
  }
  setTurn(turn) {
    if (turn < 0) return -1;
    return (this.turn = turn);
  }

  addHp(hp) {
    if (this.hp + hp < 0) {
      this.hp = 0;
    } else if (this.hp + hp > this.maxHp) {
      this.hp = this.maxHp;
    } else {
      this.hp += hp;
    }
    return this.hp;
  }
  addMp(mp) {
    if (this.mp + mp < 0) {
      return -1;
    } else if (this.mp + mp > this.maxMp) {
      this.mp = this.maxMp;
    } else {
      this.mp += mp;
    }
    return this.mp;
  }

  subHp(hp) {
    if (hp <= 0) {
      hp = 1;
    }
    this.addHp(hp * -1);
  }
  subMp(mp) {
    this.addMp(mp * -1);
  }
}

export default Entity;
