import { config } from '../../config/config.js';
import { loadNavMesh } from '../../init/navMeshLoader.js';
import makePacket from '../../utils/packet/makePacket.js';
import Packet from '../../utils/packet/packet.js';
import payload from '../../utils/packet/payload.js';
import { Monster } from '../monster.class.js';

// 몬스터 매니저 클래스
class MonsterSession {
  constructor() {
    this.monsters = new Map();
    this.mapAreas = new Map();
    this.navMeshes = new Map(); // 맵별 NavMesh 저장
    this.player = null;

    this.lastUpdateTime = 0;
    this.updateInterval = 200; // 200ms 간격
  }

  // NavMesh 로드 및 설정
  async loadMapNavMesh(mapcode, objFile) {
    try {
      const navMesh = await loadNavMesh(objFile);
      this.navMeshes.set(mapcode, navMesh);
      return true;
    } catch (error) {
      console.error(`Failed to load NavMesh for map ${mapcode}:`, error);
      return false;
    }
  }

  // 맵의 구역 정보 추가
  addMapAreas(mapcode, areas) {
    this.mapAreas.set(mapcode, areas);
  }

  // 맵의 구역 정보 가져오기
  getMapAreas(mapcode) {
    return this.mapAreas.get(mapcode);
  }

  // 몬스터 생성
  spawnMonster(mapcode, area) {
    const id = this.monsters.size + 1;
    const monster = new Monster(mapcode, id, area);

    // 해당 맵의 구역 정보 확인
    const mapAreas = this.getMapAreas(mapcode);
    if (mapAreas && mapAreas[area]) {
      monster.initialize(mapAreas[area]);
    } else {
      console.error(`Area ${area} not found in map ${mapcode}`);
      return null;
    }

    this.monsters.set(id, monster);
    return monster;
  }

  // 맵 초기화 (구역당 2마리씩 배치)
  async initializeMap(mapcode, objFile) {
    // NavMesh 로드
    if (!this.navMeshes.has(mapcode)) {
      const success = await this.loadMapNavMesh(mapcode, objFile);
      if (!success) return;
    }

    const mapAreas = this.getMapAreas(mapcode);
    if (!mapAreas) {
      console.error(`Map ${mapcode} areas not defined`);
      return;
    }

    // 각 구역에 2마리씩 몬스터 생성
    for (const areaId in mapAreas) {
      this.spawnMonster(mapcode, areaId);
      this.spawnMonster(mapcode, areaId);
    }
  }

  async update() {
    const currentTime = Date.now();
    // 200ms가 지났는지 확인
    if (currentTime - this.lastUpdateTime >= this.updateInterval) {
      // 플레이어가 있고 연결되어 있다면
      console.log(this.player);
      if (this.player) {
        for (const monster of this.monsters.values()) {
          // 몬스터의 ID와 현재 위치 가져오기
          const monsterId = monster.id;
          const monsterPosition = {
            x: monster.position.x,
            y: monster.position.y,
            z: monster.position.z,
          };

          // S2CMonsterLocation 패킷 생성
          // const monsterInfo = Packet.S2CMonsterLocation(
          //   monsterId,
          //   monsterPosition,
          // );

          // 패킷 전송
          const monsterInfo = payload.S2CTownEnter(monsterId);
          console.log(monsterInfo);
          const packet = makePacket(
            config.packetId.S2CMonsterLocation,
            monsterInfo,
          );

          console.log(packet);
          this.player.emit(packet);
          console.log('패킷 전송중');
        }
      }

      this.lastUpdateTime = currentTime;
    }
  }

  // 특정 맵의 몬스터만 업데이트
  async updateMapMonsters(mapcode, players) {
    const currentTime = Date.now();
    const updates = [];
    const navMesh = this.navMeshes.get(mapcode);

    if (!navMesh) {
      console.error(`NavMesh not found for map ${mapcode}`);
      return updates;
    }

    for (const monster of this.monsters.values()) {
      if (monster.mapcode === mapcode) {
        const updatePacket = await monster.update(
          players,
          currentTime,
          navMesh,
        );
        if (updatePacket) {
          updates.push(updatePacket);
        }
      }
    }

    return updates;
  }

  // 특정 맵의 몬스터 모두 제거
  clearMap(mapcode) {
    for (const [id, monster] of this.monsters.entries()) {
      if (monster.mapcode === mapcode) {
        this.monsters.delete(id);
      }
    }
    this.navMeshes.delete(mapcode);
  }

  async initArea() {
    await this.addMapAreas(1, {
      1: { x: 0, y: 0, z: 0 },
      2: { x: -69.04828, y: 0, z: 0 },
      3: { x: -69.04828, y: 0, z: -69.04828 },
      4: { x: 0, y: 0, z: -69.04828 },
      5: { x: 69.04828, y: 0, z: 0 },
      6: { x: 69.04828, y: 0, z: -69.04828 },
    });
    const navObjectName = 'Test Exported NavMesh.obj';
    await this.loadMapNavMesh(1, navObjectName);

    await this.initializeMap(1, navObjectName);
  }
}

export default MonsterSession;
