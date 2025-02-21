import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import Resource from './resource.class.js';
import { getGameAssets } from '../init/assets.js';
import Packet from '../utils/packet/packet.js';
//import BattleStatus from './battleStatus.class.js';
class Sector {
  constructor(sectorId, sectorCode, resources = []) {
    this.id = sectorId;
    this.code = sectorCode;
    this.monsters = [];
    this.players = new Map();
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
      const resourceIdx = this.resources.length + 1;
      this.resources.push(new Resource(resourceIdx, id, resource));
      return resourceIdx;
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

    player.sendPacket(Packet.S2CResourceList(resourceData));
    return this.players.set(socket, player);
  }

  deletePlayer(socket) {
    return this.players.delete(socket);
  }

  // monsters는 monster 인스턴스들이 담긴 일반 배열
  setMonsters(monsters) {
    this.monsters = monsters;
  }

  notify(packet) {
    this.players.values.forEach((player) => {
      player.sendPacket(packet);
    });
  }
}

export default Sector;
