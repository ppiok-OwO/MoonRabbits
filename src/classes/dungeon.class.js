import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import Resource from './resource.class.js';
import { getGameAssets } from '../init/assets.js';
import Packet from '../utils/packet/packet.js';
//import BattleStatus from './battleStatus.class.js';
class Dungeon {
  constructor(dungeonId, dungeonCode, resources = []) {
    this.id = dungeonId;
    this.code = dungeonCode;
    this.monsters = [];
    this.players = new Map();
    this.resourceIdx = 0;
    this.resources = [];
    //this.battleStatus = null;
    resources.forEach((value) => {
      this.setResource(value);
    });
  }

  setResource(resourceId) {
    const resource = getGameAssets().resources.data.find((value) => {
      return value.resource_id === resourceId;
    });
    if (resource) {
      this.resourceIdx++;
      this.resources.push(new Resource(this.resourceIdx, id, resource));
      return this.resourceIdx;
    }
    return -1;
  }
  subDurability(resourceIdx, sub = 1) {
    if (resourceIdx >= 0 && resourceIdx < this.resources.length) {
      const durability = this.resources[resourceIdx].subDurability(sub);
      this.notify(Packet.S2CUpdateDurability(resourceIdx, durability));
      return durability;
    }
    return -1;
  }
  resetDurability(resourceIdx) {
    if (resourceIdx >= 0 && resourceIdx < this.resources.length) {
      const durability = this.resources[resourceIdx].resetDurability();
      this.notify(Packet.S2CUpdateDurability(resourceIdx, durability));
      return durability;
    }
    return -1;
  }

  setPlayer(socket, player) {
    const resourceData = resources.map((value, index) => {
      PAYLOAD_DATA.Resource(index, value.getResourceId());
    });

    player.sendPacket(Packet.S2CResourcesList(resourceData));
    return this.players.set(socket, player);
  }

  deletePlayer(socket) {
    return this.players.delete(socket);
  }

  // monsters는 monster 인스턴스들이 담긴 일반 배열
  setMonsters(monsters) {
    this.monsters = monsters;
  }

  getDungeonInfo() {
    const monsterStatus = this.monsters.map((monster) => {
      return monster.getMonsterStatus();
    });

    return PAYLOAD_DATA.DungeonInfo(this.code, monsterStatus);
  }

  notify(packet) {
    this.players.values.forEach((player) => {
      player.sendPacket(packet);
    });
  }

  //전투 게시 함수 (플레이어와 몬스터 반드시 설정 필요.)
  // setBattleStatus() {
  //   this.battleStatus = new BattleStatus(this, this.players, this.monsters);
  // }
}

export default Dungeon;
