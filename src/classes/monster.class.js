import { findPath, loadNavMesh } from '../init/navMeshLoader.js';
import { getPlayerSession } from '../session/sessions.js';

class Monster {
  constructor(mapcode, id, area) {
    this.mapcode = mapcode; // 맵 코드 - 어느 씬에 있는지
    this.id = id; // 몬스터 ID - 어떤 몬스터인지 구분
    this.area = area; // 구역 정보
    this.moveSpeed = 7; // 이동 속도
    this.anglerSpeed = 150; // 회전 속도
    this.acc = 10; // 가속도
    this.target = null; // 현재 타겟
    this.lastUpdateTime = 0; // 마지막 업데이트 시간
    this.updateInterval = 100; // 10프레임 (100ms) 간격으로 위치 업데이트
    this.position = { x: 0, y: 0, z: 0 };
    this.homePosition = { x: 0, y: 0, z: 0 };
    this.detectionRange = 60; // 감지 범위
    this.roamingRange = 45; // 배회 범위 (-45 ~ +45)
    this.collisionRange = 0.5; // 충돌 판정 범위
    this.currentPath = []; // 현재 이동 경로
    this.pathIndex = 0; // 현재 경로에서의 위치
    this.stepSize = 10; // 경로 보간 간격 // 이전은 0.25였음
  }

  // 몬스터 초기 위치 설정
  initialize(areaData) {
    this.homePosition = { ...areaData };
    this.position = { ...areaData };
  }

  // 플레이어와의 거리 계산
  getDistanceToPlayer(playerPosition) {
    const dx = this.position.x - playerPosition.posX;
    const dz = this.position.z - playerPosition.posZ;
    return Math.sqrt(dx * dx + dz * dz);
  }

  // 홈 위치와의 거리 계산
  getDistanceToHome() {
    const dx = this.position.x - this.homePosition.x;
    const dz = this.position.z - this.homePosition.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  // 몬스터가 자신의 구역을 벗어났는지 확인
  isOutOfBounds() {
    return this.getDistanceToHome() > this.roamingRange;
  }

  // 플레이어가 감지 범위 안에 있는지 확인
  isPlayerInRange(playerPosition) {
    return this.getDistanceToPlayer(playerPosition) <= this.detectionRange;
  }

  // 플레이어와 충돌했는지 확인
  hasCollisionWith(playerPosition) {
    return this.getDistanceToPlayer(playerPosition) <= this.collisionRange;
  }

  // 새로운 경로 계산
  async calculatePath(navMesh, targetPosition) {
    try {
      const path = await findPath(
        navMesh,
        this.position,
        targetPosition,
        this.stepSize,
      );

      if (!path || path.length === 0) {
        this.currentPath = [
          {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
          },
        ];
      } else {
        this.currentPath = path;
      }
      this.pathIndex = 0;
      return true;
    } catch (error) {
      console.error('Path finding error:', error);
      return false;
    }
  }

  // 경로를 따라 이동
  moveAlongPath() {
    if (!this.currentPath || this.pathIndex >= this.currentPath.length) {
      return false;
    }

    const targetPoint = this.currentPath[this.pathIndex];
    const dx = targetPoint.x - this.position.x;
    const dz = targetPoint.z - this.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < this.stepSize) {
      this.pathIndex++;
      return true;
    }

    const movement = this.moveSpeed * (this.updateInterval / 1000);
    const ratio = Math.min(movement / distance, 1);
    const minMovement = 0.01;

    this.position.x += dx * Math.max(ratio, minMovement);
    this.position.z += dz * Math.max(ratio, minMovement);
    return true;
  }

  // 몬스터 업데이트 함수
  async update(players, currentTime, navMesh) {
    // 10프레임마다 업데이트
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return null;
    }
    this.lastUpdateTime = currentTime;

    // 현재 경로가 없거나 끝나면
    if (!this.currentPath || this.pathIndex >= this.currentPath.length) {
      const randomAngle = ((Math.random() - 0.5) * Math.PI) / 2;
      const randomDist = Math.random() * this.roamingRange;
      const randomTarget = {
        x: this.homePosition.x + Math.cos(randomAngle) * randomDist,
        y: this.homePosition.y,
        z: this.homePosition.z + Math.sin(randomAngle) * randomDist,
      };
      await this.calculatePath(navMesh, randomTarget);
    }

    this.moveAlongPath();

    // 구역을 벗어났다면 홈으로 복귀
    if (this.isOutOfBounds()) {
      this.target = null;
      if (!this.currentPath || this.currentPath.length === 0) {
        await this.calculatePath(navMesh, this.homePosition);
      }
      this.moveAlongPath();
      return this.createUpdatePacket();
    }

    // 주변 플레이어 탐색
    let nearestPlayer = null;
    let nearestDistance = Infinity;

    const temp = players.entries();

    for (const player of temp) {
      const position = player[1].position;
      if (this.isPlayerInRange(position)) {
        const distance = this.getDistanceToPlayer(position);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPlayer = player;
        }
      }
    }

    // 타겟 설정 및 이동
    if (nearestPlayer) {
      this.target = nearestPlayer;
      await this.calculatePath(navMesh, nearestPlayer.position);
      this.moveAlongPath();
    } else {
      this.target = null;
      if (!this.currentPath || this.currentPath.length === 0) {
        const randomAngle = ((Math.random() - 0.5) * Math.PI) / 2;
        const randomDist = Math.random() * this.roamingRange;
        const randomTarget = {
          x: this.homePosition.x + Math.cos(randomAngle) * randomDist,
          y: this.homePosition.y,
          z: this.homePosition.z + Math.sin(randomAngle) * randomDist,
        };
        await this.calculatePath(navMesh, randomTarget);
      }
      this.moveAlongPath();
    }

    return this.createUpdatePacket();
  }

  // 업데이트 패킷 생성
  createUpdatePacket() {
    return {
      id: this.id,
      mapcode: this.mapcode,
      area: this.area,
      position: { ...this.position },
      hasTarget: this.target !== null,
    };
  }
}

export { Monster };
