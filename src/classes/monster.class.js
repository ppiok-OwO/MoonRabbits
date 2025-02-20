import Entity from './stat.class.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';

class Monster extends Entity {
  constructor(
    monsterIdx,
    monsterModel,
    monsterName,
    stat = PAYLOAD_DATA.StatInfo(1, 100, 100, 100, 100, 20, 5, 10, 50),
  ) {
    super(stat);
    this.idx = monsterIdx;
    this.model = monsterModel;
    this.name = monsterName;
  }

  takeDamage(damage) {
    return this.stat.subtrackHp(damage);
  }

  getMonsterStatus() {
    return PAYLOAD_DATA.MonsterStatus(
      this.idx,
      this.model,
      this.name,
      this.getHp(),
    );
  }

  getMonsterStat() {
    return this.stat;
  }
  getMonsterStats() {
    return {
      hp: this.hp,
    };
  }
}

export default Monster;
