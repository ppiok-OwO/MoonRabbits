import payloadData from '../utils/packet/payloadData';

class stats {
  constructor(
    statInfo = payloadData.StatInfo(1, 100, 100, 100, 100, 10, 5, 10, 50),
  ) {
    const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed } = statInfo;
    this.level = level;
    this.hp = hp;
    this.maxHp = maxHp;
    this.mp = mp;
    this.maxMp = maxMp;
    this.atk = atk;
    this.def = def;
    this.magic = magic;
    this.speed = speed;
  }

  getPlayerStats() {
    return {
      level: this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      mp: this.mp,
      maxMp: this.maxMp,
      atk: this.atk,
      def: this.def,
      magic: this.magic,
      speed: this.speed,
    };
  }
  getMonsterStats() {
    return {
      hp: this.hp,
    };
  }
  getLevel() {
    return this.level;
  }
  getHp() {
    return this.hp;
  }
  getMaxHp() {
    return this.maxHp;
  }
  getMp() {
    return this.mp;
  }
  getMaxMp() {
    return this.maxMp;
  }
  getAtk() {
    return this.atk;
  }
  getDef() {
    return this.def;
  }
  getMagic() {
    return this.magic;
  }
  getSpeed() {
    return this.speed;
  }

  setLevel(level_int) {
    if (level_int < 0) {
      return -1;
    }
    return (this.level = level_int);
  }
  setHp(hp_float) {
    if (hp_float < 0) {
      return -1;
    }
    if (hp_float > this.maxHp) {
      return (this.hp = this.maxHp);
    }
    return (this.hp = hp_float);
  }
  setMaxHp(maxHp_float) {
    if (maxHp_float < 0) {
      return -1;
    }
    return (this.maxHp = maxHp_float);
  }
  setMp(mp_float) {
    if (mp_float < 0) {
      return -1;
    }
    if (mp_float > this.maxMp) {
      return (this.mp = this.maxMp);
    }
    return (this.mp = mp_float);
  }
  setMaxMp(maxMp_float) {
    if (maxMp_float < 0) {
      return -1;
    }
    return (this.maxMp = maxMp_float);
  }
  setAtk(atk_float) {
    return (this.atk = atk_float);
  }
  setDef(def_float) {
    return (this.def = def_float);
  }
  setMagic(magic_float) {
    return (this.magic = magic_float);
  }
  setSpeed(speed_float) {
    return (this.speed = speed_float);
  }

  subtrackHp(hp_float) {
    if (hp_float > this.hp) {
      this.hp = 0;
    }
    return this.hp;
  }
  addHp(hp_float) {
    if (hp_float + this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    return this.hp;
  }

  subtrackMp(mp_float) {
    if (mp_float > this.mp) {
      return -1;
    }
    return this.mp;
  }
  addMp(mp_float) {
    if (mp_float + this.mp > this.maxMp) {
      this.mp = this.maxMp;
    }
    return this.mp;
  }
}

export default stats;
