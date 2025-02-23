import { config } from '../../config/config.js';
import { loadNavMesh } from '../../init/navMeshLoader.js';
import {
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';
import { Monster } from '../monster.class.js';

// 몬스터 매니저 클래스
// class MonsterSession {
//   constructor() {
//     this.monsters = new Map();
//     this.mapAreas = new Map();
//     this.navMeshes = new Map(); // 맵별 NavMesh 저장
//     this.lastUpdateTime = 0;
//     this.updateInterval = 50; // 200ms 간격 //Todo: 나중에 200ms 수정해야함 // 200ms는 gpt형님께서 오히려 몬스터의 계산처리를 느리게함
//     this.socket = null;

//     this.initArea(); // 클래스 내부 자동 호출
//   }

//   // NavMesh 로드 및 설정
//   async loadMapNavMesh(mapcode, objFile) {
//     try {
//       const navMesh = await loadNavMesh(objFile);
//       this.navMeshes.set(mapcode, navMesh);
//       return true;
//     } catch (error) {
//       console.error(`Failed to load NavMesh for map ${mapcode}:`, error);
//       return false;
//     }
//   }

//   // 맵의 구역 정보 추가
//   addMapAreas(mapcode, areas) {
//     this.mapAreas.set(mapcode, areas);
//   }

//   // 맵의 구역 정보 가져오기
//   getMapAreas(mapcode) {
//     return this.mapAreas.get(mapcode);
//   }

//   // 몬스터 생성
//   spawnMonster(mapcode, area) {
//     const namesh = this.navMeshes.get(mapcode);
//     const id = this.monsters.size + 1;
//     const monster = new Monster(mapcode, id, area, namesh);

//     // 해당 맵의 구역 정보 확인
//     const mapAreas = this.getMapAreas(mapcode);
//     if (mapAreas && mapAreas[area]) {
//       monster.initialize(mapAreas[area]);
//     } else {
//       console.error(`Area ${area} not found in map ${mapcode}`);
//       return null;
//     }

//     this.monsters.set(id, monster);
//     return monster;
//   }

//   // 맵 초기화 (구역당 2마리씩 배치)
//   async initializeMap(mapcode, objFile) {
//     // NavMesh 로드
//     if (!this.navMeshes.has(mapcode)) {
//       const success = await this.loadMapNavMesh(mapcode, objFile);
//       if (!success) return;
//     }

//     const mapAreas = this.getMapAreas(mapcode);
//     if (!mapAreas) {
//       console.error(`Map ${mapcode} areas not defined`);
//       return;
//     }

//     // 각 구역에 2마리씩 몬스터 생성
//     for (const areaId in mapAreas) {
//       this.spawnMonster(mapcode, areaId);
//       this.spawnMonster(mapcode, areaId);
//     }
//   }

  // async update() {
  //   const players = getPlayerSession().getAllPlayers();
  //   const dungeonCount = getTestDungeonSessions().players.size;
  //   if (dungeonCount === 0 || this.isUpdating) return;

//     const currentTime = Date.now();
//     if (currentTime - this.lastUpdateTime < this.updateInterval) return;

//     try {
//       this.isUpdating = true;

//       // 몬스터들을 그룹으로 나누어 병렬 처리
//       const monsterGroups = this.divideMonsters(
//         Array.from(this.monsters.values()),
//       );

//       // 각 그룹을 비동기적으로 처리
//       const updatePromises = monsterGroups.map((group) =>
//         Promise.all(
//           group.map((monster) =>
//             this.updateMonster(monster, players, currentTime),
//           ),
//         ),
//       );

//       // 모든 그룹의 업데이트 완료 대기
//       await Promise.all(updatePromises);

//       this.lastUpdateTime = currentTime;
//     } finally {
//       this.isUpdating = false;
//     }
//   }

//   // 몬스터 업데이트를 개별 Promise로 래핑
//   async updateMonster(monster, players, currentTime) {
//     try {
//       await monster.update(players, currentTime);
//     } catch (error) {
//       console.error(`Monster ${monster.id} update failed:`, error);
//     }
//   }

//   // 몬스터들을 여러 그룹으로 나누기 (성능 최적화)
//   divideMonsters(monsters) {
//     const groupSize = 12; // 한 그룹당 몬스터 수 조절
//     const groups = [];

//     for (let i = 0; i < monsters.length; i += groupSize) {
//       groups.push(monsters.slice(i, i + groupSize));
//     }

//     return groups;
//   }

//   // 특정 맵의 몬스터 모두 제거
//   clearMap(mapcode) {
//     for (const [id, monster] of this.monsters.entries()) {
//       if (monster.mapcode === mapcode) {
//         this.monsters.delete(id);
//       }
//     }
//     this.navMeshes.delete(mapcode);
//   }

//   async initArea() {
//     await this.addMapAreas(2, {
//       1: { x: 0, y: 0, z: 0 },
//       2: { x: -69.04828, y: 0, z: 0 },
//       3: { x: -69.04828, y: 0, z: -69.04828 },
//       4: { x: 0, y: 0, z: -69.04828 },
//       5: { x: 69.04828, y: 0, z: 0 },
//       6: { x: 69.04828, y: 0, z: -69.04828 },
//     });
//     const navObjectName = 'Test Exported NavMesh.obj';
//     await this.loadMapNavMesh(2, navObjectName);

//     await this.initializeMap(2, navObjectName);

//     setInterval(async () => {
//       await this.update();
//     }, 16); // 게임 프레임 간격으로 호출
//   }
// }

// export default MonsterSession;
