class Monster {
  constructor(monsterIdx, monsterModel, monsterName, monsterHp) {
    this.idx = monsterIdx;
    this.model = monsterModel;
    this.name = monsterName;
    this.maxHp = monsterHp;
    this.currentHp = monsterHp;
  }

  takeDamage(damage) {
    this.currentHp -= damage;
  }
}

export default Monster;
