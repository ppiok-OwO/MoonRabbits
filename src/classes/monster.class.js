import stats from './stats.class.js';
import payloadData from '../utils/packet/payloadData.js';

class Monster {
  constructor(monsterIdx, monsterModel, monsterName, stat = new stats()) {
    this.idx = monsterIdx;
    this.model = monsterModel;
    this.name = monsterName;
    this.stat = stat;
  }

  takeDamage(damage) {
    return this.stat.subtrackHp(damage);
  }

  getMonsterStatus() {
    return payloadData.MonsterStatus(
      this.idx,
      this.model,
      this.name,
      this.stat.getHp(),
    );
  }

  getMonsterStat(){
    return this.stat;
  }
}

export default Monster;
