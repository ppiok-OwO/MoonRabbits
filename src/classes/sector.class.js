import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import Resource from './resource.class.js';
import { getGameAssets } from '../init/assets.js';
import Packet from '../utils/packet/packet.js';
import { Monster } from './monster.class.js';
import { getNaveMesh } from '../init/navMeshData.js';

class Sector {
  constructor(sectorId, sectorCode, resourcesId = []) {
    this.sectorId = sectorId;
    this.sectorCode = sectorCode;
    this.monsters = new Map();
    this.mapAreas = [];
    this.navMeshes = new Map(); // 맵별 NavMesh 저장
    this.players = new Map();
    this.resources = [];
    this.lastUpdateTime = Date.now();
    this.isUpdating = false;
    //this.battleStatus = null;
    resourcesId.forEach((value) => {
      this.setResource(value);
    });

    this.initArea(); // 클래스 내부 자동 호출
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
    if (this.resources.size > 0) {
      const resourceData = resources.map((value, index) => {
        PAYLOAD_DATA.Resource(index, value.getResourceId());
      });

      player.sendPacket(Packet.S2CResourceList(resourceData));
    }
    console.log(this.players);
    return this.players.set(socket, player);
  }

  deletePlayer(socket) {
    return this.players.delete(socket);
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }
  getAllPlayer() {
    return this.players;
  }

  // monsters는 monster 인스턴스들이 담긴 일반 배열
  setMonsters(monsters) {
    this.monsters = monsters;
  }

  notify(packet) {
    for (const player of this.players.values()) {
      console.log('noti', packet);
      player.sendPacket(packet);
    }
  }

  // 맵의 구역 정보 추가
  async addMapAreas(areas) {
    this.mapAreas.push(areas);
  }

  // 맵의 구역 정보 가져오기
  getMapAreas() {
    return this.mapAreas;
  }
  // 몬스터 생성
  spawnMonster(monster, mapcode) {
    const namesh = this.navMeshes.get(mapcode);

    if (this.mapAreas && this.mapAreas[area]) {
      monster.initialize(this.mapAreas[area]);
    } else {
      console.error(`Area ${area} not found in map ${mapcode}`);
      return null;
    }

    const id = this.monsters.size + 1;
    this.monsters.set(id, monster);
    return monster;
  }

  // 몬스터들을 여러 그룹으로 나누기 (성능 최적화)
  divideMonsters(monsters) {
    const groupSize = 12; // 한 그룹당 몬스터 수 조절
    const groups = [];

    for (let i = 0; i < monsters.length; i += groupSize) {
      groups.push(monsters.slice(i, i + groupSize));
    }

    return groups;
  }

  // 몬스터 업데이트를 개별 Promise로 래핑
  async updateMonster(monster, currentTime) {
    if (!monster) return;
    try {
      await monster.update(currentTime);
    } catch (error) {
      console.error(`Monster ${monster.monsterIdx} update failed:`, error);
    }
  }

  async update() {
    if (this.players.size === 0 || this.isUpdating) return;

    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < this.updateInterval) return;

    try {
      this.isUpdating = true;

      // 몬스터들을 그룹으로 나누어 병렬 처리
      const monsterGroups = this.divideMonsters(
        Array.from(this.monsters.values()),
      );

      // 각 그룹을 비동기적으로 처리
      const updatePromises = monsterGroups.map((group) =>
        Promise.all(
          group.map((monster) => this.updateMonster(monster, currentTime)),
        ),
      );

      // 모든 그룹의 업데이트 완료 대기
      await Promise.all(updatePromises);

      this.lastUpdateTime = currentTime;
    } finally {
      this.isUpdating = false;
    }
  }

  async initArea() {
    const sectorJsonData = getGameAssets().sector.data.find((value) => {
      return Number(value.sector_code) === Number(this.sectorCode);
    });

    if (!sectorJsonData) {
      console.error(
        `섹터 코드 ${this.sectorCode}에 대한 데이터를 찾을 수 없습니다`,
      );
      return;
    }

    // monsters 배열이 있는지 확인
    if (!Array.isArray(sectorJsonData.monsters)) {
      console.error('몬스터 데이터가 올바른 형식이 아닙니다:', sectorJsonData);
      return;
    }

    this.navMeshes.set(this.sectorCode, getNaveMesh(this.sectorCode));

    // 모든 area를 한번에 추가
    this.mapAreas = sectorJsonData.areas || [];

    sectorJsonData.monsters.forEach((monster, index) => {
      const monsterIdx = index + 1;
      this.monsters.set(
        monsterIdx,
        new Monster(
          this.sectorCode,
          monsterIdx,
          sectorJsonData.areas[monster.areaIdx],
        ),
      );
    });

    setInterval(async () => {
      await this.update();
    }, 16); // 게임 프레임 간격으로 호출
  }
}

export default Sector;
