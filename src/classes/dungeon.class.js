import payloadData from '../utils/packet/payloadData.js';
import BattleStatus from './battleStatus.class.js';
class Dungeon {
  constructor(dungeonId, dungeonCode) {
    this.id = dungeonId;
    this.code = dungeonCode;
    this.monsters = [];
    this.players = new Map();
    this.battleStatus = null;
  }

  // players는 player 인스턴스들이 담긴 일반 배열
  setPlayers(players) {
    for (const player of players) {
      this.players.set(player.socket, player);
    }
  }

  // monsters는 monster 인스턴스들이 담긴 일반 배열
  setMonsters(monsters) {
    this.monsters = monsters;
  }

  getDungeonInfo() {
    const monsterStatus = this.monsters.map((monster) => {
      return monster.getMonsterStatus();
    });
    payloadData.DungeonInfo(this.code, monsterStatus);
  }

  notify(packet) {
    for (const player of this.players.keys()) {
      player.write(packet);
    }
  }

  //전투 게시 함수 (플레이어와 몬스터 반드시 설정 필요.)
  setBattleStatus() {
    this.battleStatus = new BattleStatus(
      this,
      Array.from(this.players, ([key, value]) => {
        return value;
      }),
      this.monsters,
    );
  }
}

export default Dungeon;
