import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import Resource from './resource.class.js';
import { getGameAssets } from '../init/assets.js';
import PACKET from '../utils/packet/packet.js';
import Monster from './monster.class.js';
import { getNaveMesh } from '../init/navMeshData.js';

class Sector {
  constructor(sectorId, sectorCode, resources = []) {
    this.sectorId = sectorId;
    this.sectorCode = sectorCode;
    this.monsters = new Map();
    this.mapAreas = [];
    this.navMeshes = new Map(); // 맵별 NavMesh 저장
    this.players = new Map();
    this.resources = resources;
    this.traps = new Map();

    // 업데이트 관련 속성
    this.lastUpdateTime = Date.now();
    this.updateInterval = 16; // 기본 업데이트 간격
    this.isUpdating = false;

    // 패킷 전송 관련 속성 (별도 관리)
    this.packetSendInterval = 200; // 패킷 전송 간격
    this.packetSendTimer = null; // 패킷 전송용 타이머

    this.initArea(); // 클래스 내부 자동 호출
    this.initPacketSendTimer(); // 패킷 전송 타이머 초기화
  }

  // 패킷 전송 타이머 초기화
  initPacketSendTimer() {
    if (this.packetSendTimer) {
      clearInterval(this.packetSendTimer);
    }

    // 패킷을 전송하는 타이머 설정
    this.packetSendTimer = setInterval(() => {
      this.sendMonsterPackets();
    }, this.packetSendInterval);

    console.log(
      `몬스터 패킷 전송 타이머 시작: ${this.packetSendInterval}ms 간격`,
    );
  }

  // 몬스터 패킷 전송 함수
  async sendMonsterPackets() {
    // 플레이어가 없으면 패킷 전송하지 않음
    if (this.players.size === 0) return;

    try {
      const currentTime = Date.now();
      const packets = [];

      // 몬스터 패킷 생성
      for (const monster of this.monsters.values()) {
        try {
          const packet = await monster.createPacket(currentTime);
          if (packet) {
            packets.push(packet);
          }
        } catch (error) {
          console.error(
            `몬스터 패킷 생성 오류 (ID: ${monster.monsterIdx}):`,
            error,
          );
        }
      }

      // 생성된 패킷 전송
      for (const packet of packets) {
        this.notify(packet);
      }

      // 디버깅: 전송된 패킷 수 로깅
      if (packets.length > 0) {
        console.log(
          `${new Date().toISOString()} - 전송된 몬스터 패킷: ${packets.length}개`,
        );
      }
    } catch (error) {
      console.error('몬스터 패킷 전송 중 오류 발생:', error);
    }
  }

  setResource(resourceId) {
    const resource = getGameAssets().resources.data.find((value) => {
      return value.resource_id === resourceId;
    });
    if (resource) {
      const resourceIdx = this.resources.length;
      this.resources.push(new Resource(resourceIdx, resourceId, resource));
      return resourceIdx;
    }
    return -1;
  }

  resetDurability(resourceIdx) {
    if (resourceIdx >= 0 && resourceIdx < this.resources.length) {
      const durability = this.resources[resourceIdx].resetDurability();
      this.notify(PACKET.S2CUpdateDurability(resourceIdx, durability));
      return durability;
    }
    return -1;
  }

  setPlayer(socket, player) {
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

  getMonster(id) {
    const monster = Array.from(this.monsters.values()).find(
      (monster) => monster.monsterIdx === id,
    );
    return monster || null; // 몬스터가 존재하지 않으면 null 반환
  }

  setMonsters(monsters) {
    monsters.forEach((monster, id) => {
      this.monsters.set(id, monster);
    });
  }

  notify(packet) {
    for (const player of this.players.values()) {
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

  /* 섹터에 신규 덫 정보 추가 */
  setTrap(casterId, pos) {
    // [1] 설치한 덫이 없으면 Map 인스턴스 할당
    if (!this.traps.has(casterId)) this.traps.set(casterId, new Map());
    // [2] 플레이어별 덫 Map에 설치할 덫 위치정보 삽입
    const trapKey = `${pos.x}${pos.z}`;
    this.traps.get(casterId).set(trapKey, pos);
    // [3] 설치한 덫 정보 반환
    return PAYLOAD_DATA.TrapInfo(casterId, pos);
  }

  /* 특정 덫 제거 */
  deleteTrap(casterId, pos, socket) {
    // [1] 플레이의 덫 Map 가져옴
    const currentTraps = this.traps.get(casterId);
    console.log('!!! 지우기 전 : ', currentTraps);
    console.log('!!! 지울 넘 : ', pos);
    // [2] 클라의 위치정보와 일치하는 덫이 없다면 리턴
    const trapKey = `${pos.x}${pos.z}`;
    if (!currentTraps.has(trapKey)) {
      socket.write(PACKET.S2CChat(0, '제거할 덫 정보가 없습니다', 'System'));
      return;
    }
    // [3] 해당 덫 Map에서 제거
    if (currentTraps.delete(trapKey)) {
      console.log('!!! 지운 후 : ', currentTraps);
      // [4] 제거 성공 시 제거한 덫 정보 반환
      return PAYLOAD_DATA.TrapInfo(casterId, pos);
    }
  }

  /* 특정 플레이어의 모든 덫 제거 */
  removeTraps(casterId) {
    // [1] 제거할 플레이어의 덫들 보관할 배열 선언
    const traps = [];
    // [2] 플레이어의 덫 정보가 있으면 Map 순회하며 덫들 배열에 삽입
    if (this.traps.has(casterId)) {
      this.traps.get(casterId).forEach((trapPos) => {
        traps.push(PAYLOAD_DATA.TrapInfo(casterId, trapPos));
      });
      // [3] 섹터의 전체 덫 Map에서 해당 플레이어 관련 정보 제거
      if (this.traps.delete(casterId)) {
        // [4] 제거 성공 시 제거할 덫들 반환
        return traps;
      }
    }
  }

  /* 섹터의 모든 덫 정보 조회 */
  getAllTraps() {
    // [1] 덫들 보관할 배열 선언
    const traps = [];
    // [2] 플레이어별로 순회하며 보유 덫들 배열에 삽입
    this.traps.forEach((currentTraps, playerId) => {
      currentTraps.forEach((trapPos) => {
        traps.push(PAYLOAD_DATA.TrapInfo(playerId, trapPos));
      });
    });
    // [3] 섹터 덫 현황 담긴 배열 반환
    return traps;
  }

  // 몬스터 생성
  spawnMonster(monster, mapcode, area) {
    const navMesh = this.navMeshes.get(mapcode);

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

  // 몬스터들을 여러 그룹으로 나누기
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
    if (!monster) return null;

    try {
      // 몬스터 업데이트 실행
      return await monster.update(currentTime, false);
    } catch (error) {
      console.error(`Monster ${monster.monsterIdx} update failed:`, error);
      return null;
    }
  }

  // 섹터 업데이트
  async update() {
    // 플레이어가 없거나 이미 업데이트 중이면 실행하지 않음
    if (this.players.size === 0 || this.isUpdating) return;

    const currentTime = Date.now();
    // 업데이트 간격이 지나지 않았으면 실행하지 않음
    if (currentTime - this.lastUpdateTime < this.updateInterval) return;

    try {
      this.isUpdating = true;

      // 몬스터들을 그룹으로 나누어 처리
      const monsterGroups = this.divideMonsters(
        Array.from(this.monsters.values()),
      );

      // 각 그룹에 대한 업데이트 처리
      const updatePromises = monsterGroups.map(async (group) => {
        await Promise.all(
          group.map((monster) => this.updateMonster(monster, currentTime)),
        );
      });

      // 모든 그룹의 업데이트 완료 대기
      await Promise.all(updatePromises);

      this.lastUpdateTime = currentTime;
    } finally {
      this.isUpdating = false;
    }
  }

  async initArea() {
    const sectorJsonData = getGameAssets().sectors.data.find((value) => {
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

    // 몬스터 생성 및 초기화
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

    // 업데이트 함수 정기적 호출 설정
    setInterval(async () => {
      await this.update();
    }, this.updateInterval);
  }
  setSturnMonster(monsterIds, duration) {
    for (let id of monsterIds) {
      this.monsters.get(id).startSturn(duration);
    }
  }

  getResources() {
    const resourcesPayloadData = [];
    for (let i = 1; i < this.resources.length; i++) {
      resourcesPayloadData.push(
        PAYLOAD_DATA.Resource(
          this.resources[i].getResourceIdx(),
          this.resources[i].getResourceId(),
        ),
      );
    }
    return resourcesPayloadData;
  }

  getSectorId() {
    return this.sectorId;
  }

  getSectorCode() {
    return this.sectorCode;
  }

  subDurability(resourceIdx, sub = 1) {
    if (resourceIdx >= 0 && resourceIdx < this.resources.length) {
      const durability = this.resources[resourceIdx].subDurability(sub);
      this.notify(PACKET.S2CUpdateDurability(resourceIdx, durability));
      return durability;
    }
  }

  // 타이머 정리
  destroy() {
    if (this.packetSendTimer) {
      clearInterval(this.packetSendTimer);
      this.packetSendTimer = null;
    }
  }
}

export default Sector;
