import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import Resource from './resource.class.js';
import { getGameAssets } from '../init/assets.js';
import Packet from '../utils/packet/packet.js';
import { loadNavMesh } from '../init/navMeshLoader.js';
import { Monster } from './monster.class.js';
import { getPlayerSession } from '../session/sessions.js';
class Sector {
  constructor(sectorId, sectorCode, resourcesId = []) {
    this.sectorId = sectorId;
    this.sectorCode = sectorCode;
    this.monsters = new Map();
    this.mapAreas = [];
    this.navMeshes = new Map(); // 맵별 NavMesh 저장
    this.players = new Map();
    this.resources = [];
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
    const resourceData = resources.map((value, index) => {
      PAYLOAD_DATA.Resource(index, value.getResourceId());
    });

    player.sendPacket(Packet.S2CResourceList(resourceData));
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
    this.players.values.forEach((player) => {
      player.sendPacket(packet);
    });
  }

  // 맵의 구역 정보 추가
  async addMapAreas(areas) {
    this.mapAreas.push(areas);
  }

  // 맵의 구역 정보 가져오기
  getMapAreas() {
    return this.mapAreas;
  }

  // NavMesh 로드 및 설정
  async loadMapNavMesh(objFile) {
    try {
      const navMesh = await loadNavMesh(objFile);
      this.navMeshes.set(this.sectorCode, navMesh);
      return true;
    } catch (error) {
      console.error(
        `Failed to load NavMesh for map ${this.sectorCode}:`,
        error,
      );
      return false;
    }
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
  // 맵 초기화 (구역당 2마리씩 배치)
  async initializeMap(objFile) {
    // NavMesh 로드
    if (!this.navMeshes.has(this.sectorCode)) {
      const success = await this.loadMapNavMesh(objFile);
      if (!success) return;
    }
  }

  async update() {
    const players = getPlayerSession().getAllPlayers();
    if (players.size === 0 || this.isUpdating) return;

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
          group.map((monster) =>
            this.updateMonster(monster, players, currentTime),
          ),
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
      return value.sector_code === this.sectorCode;
    });


    const navObjectName = sectorJsonData.nav_object_file;

    await this.loadMapNavMesh(navObjectName);

    await this.initializeMap(navObjectName);

    for (let i = 0; i < sectorJsonData.monster.length; i++) {
      const monsterIdx = i + 1;
      this.monsters.set(
        monsterIdx,
        new Monster(
          this.sectorCode,
          monsterIdx,
          this.mapAreas.length,
          this.navMeshes.get(this.sectorCode),
        ),
      );
      await this.addMapAreas(sectorJsonData.monster[i].position);
    }
    
    setInterval(async () => {
      await this.update();
    }, 16); // 게임 프레임 간격으로 호출
  }
}

export default Sector;
