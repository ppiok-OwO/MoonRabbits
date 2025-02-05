class Dungeon {
  constructor(dungeonId, dungeonCode) {
    this.id = dungeonId;
    this.code = dungeonCode;
    this.monsters = new Map();
    this.players = new Map();
  }

  // players는 player 인스턴스들이 담긴 일반 배열
  setPlayers(players) {
    for (const player of players) {
      this.players.set(player.id, player);
    }
  }

  setMonsters() {
    // new Monster 세 번 하고, this.monsters에 넣어주세여 ^_^
    // 식별자는 idx?로 하면 될 거 같아여
  }

  notify(packet) {
    for (const player of this.players.keys()) {
      player.write(packet);
    }
  }
}

export default Dungeon;
