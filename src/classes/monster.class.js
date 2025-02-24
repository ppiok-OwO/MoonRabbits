import { config } from '../config/config.js';
import { findPath, loadNavMesh } from '../init/navMeshLoader.js';
import makePacket from '../utils/packet/makePacket.js';
import PAYLOAD from '../utils/packet/payload.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { getSectorSessions } from '../session/sessions.js';
class Monster {
  constructor(sectorId, monsterIdx, area, navMesh) {
    this.sectorId = sectorId; // 맵 코드 - 어느 섹터에 있는지
    this.monsterIdx = monsterIdx; // 몬스터 ID - 어떤 몬스터인지 구분
    this.area = area; // 구역 정보
    this.navMesh = navMesh; 
    this.moveSpeed = 7; // 이동 속도
    this.anglerSpeed = 150; // 회전 속도
    this.acc = 10; // 가속도
    this.lastUpdateTime = 0; // 마지막 업데이트 시간
    this.updateInterval = 100; // 10프레임 (100ms) 간격으로 위치 업데이트
    this.position = { x: 0, y: 0, z: 0 };
    this.homePosition = { x: 0, y: 0, z: 0 };
    this.roamingRange = 45; // 배회 범위 (-45 ~ +45)
    this.currentPath = []; // 현재 이동 경로
    this.pathIndex = 0; // 현재 경로에서의 위치
    this.stepSize = 10; // 경로 보간 간격
  }

  // 몬스터 초기 위치 설정
  initialize(areaData) {
    this.homePosition = { ...areaData };
    this.position = { ...areaData };
  }

  getArea() {
    return this.area;
  }

  setArea(area) {
    return (this.area = area);
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

  async calculatePath(targetPosition) {
    try {
      // 홈 포지션 근처로 제한하여 이동
      const maxDistance = this.roamingRange;
      const dx = targetPosition.x - this.homePosition.x;
      const dz = targetPosition.z - this.homePosition.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // 타겟 위치가 너무 멀면 제한된 범위 내로 조정
      let adjustedTarget = { ...targetPosition };
      if (distance > maxDistance) {
        const ratio = maxDistance / distance;
        adjustedTarget.x = this.homePosition.x + dx * ratio;
        adjustedTarget.z = this.homePosition.z + dz * ratio;
      }

      const path = await findPath(
        this.navMesh,
        this.position,
        adjustedTarget,
        this.stepSize,
      );

      // 경로를 찾지 못하면 현재 위치에서 다시 계산
      if (!path || path.length === 0) {
        const homewardPath = await findPath(
          this.navMesh,
          this.position,
          this.homePosition,
          this.stepSize,
        );
        if (!homewardPath || homewardPath.length === 0) {
          this.currentPath = [];
          this.pathIndex = 0;
          return false;
        }

        this.currentPath = path;
        this.pathIndex = 0;
        return true;
      }

      this.currentPath = path;
      this.pathIndex = 0;
      return true;
    } catch (error) {
      console.error('Path finding error:', error);
      // 에러 발생시 현재 위치 정지
      this.currentPath = [];
      this.pathIndex = 0;
      return false;
    }
  }

  // 경로를 따라 이동
  moveAlongPath() {
    if (!this.currentPath || this.pathIndex >= this.currentPath.length) {
      return false; // 경로가 끝났음을 알림
    }

    const targetPoint = this.currentPath[this.pathIndex];
    const dx = targetPoint.x - this.position.x;
    const dz = targetPoint.z - this.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // 현재 경로 포인트에 도착했는지 체크
    if (distance < 0.5) {
      // 도착 판정 거리를 조금 늘림
      this.pathIndex++;
      return this.pathIndex >= this.currentPath.length; // 전체 경로가 끝났는지 반환
    }

    // 이동 속도 적용
    const movement = this.moveSpeed * (this.updateInterval / 1000);
    const ratio = Math.min(movement / distance, 1);

    // 실제 이동
    this.position.x += dx * ratio;
    this.position.z += dz * ratio;

    return false; // 아직 이동 중
  }

  // 몬스터 업데이트 함수
  async update(currentTime) {
    //if (this.monsterIdx < 9) return;
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return null;
    }
    this.lastUpdateTime = currentTime;

    try {
      // 현재 홈으로부터의 거리 체크
      const currentDistanceToHome = this.getDistanceToHome();

      // 현재 경로가 없거나, moveAlongPath가 true를 반환(경로 완료)했을 때 새로운 목적지 설정
      if (!this.currentPath || this.pathIndex >= this.currentPath.length) {
        if (currentDistanceToHome > this.roamingRange) {
          // 범위를 벗어났다면 홈으로 복귀
          await this.calculatePath(this.homePosition);
        } else {
          // 새로운 랜덤 위치 설정
          const randomAngle = Math.random() * Math.PI * 2; // 360도 전 범위
          const randomDist =
            this.roamingRange * 0.3 + Math.random() * this.roamingRange * 0.7; // 최소 30% ~ 최대 100% 범위

          const randomTarget = {
            x: this.homePosition.x + Math.cos(randomAngle) * randomDist,
            y: this.homePosition.y,
            z: this.homePosition.z + Math.sin(randomAngle) * randomDist,
          };

          // console.log(
          //   `새로운 목표 지점 설정: x=${randomTarget.x}, z=${randomTarget.z}`,
          // );
          await this.calculatePath(randomTarget);
        }
      }

      // 이동 실행
      const pathCompleted = this.moveAlongPath();

      // 현재 위치 패킷 전송
      const transformInfo = PAYLOAD_DATA.TransformInfo(
        this.position.x,
        this.position.y,
        this.position.z,
        0,
      );
      const monsterInfo = PAYLOAD.S2CMonsterLocation(this.monsterIdx, transformInfo);
      const packet = makePacket(
        config.packetId.S2CMonsterLocation,
        monsterInfo,
      );
      getSectorSessions().getSector(this.sectorId).notify(packet);
    } catch (error) {
      console.error('Monster update error:', error);
      this.position = { ...this.homePosition };
    }
  }

  // 업데이트 패킷 생성
  createUpdatePacket() {
    return {
      id: this.monsterIdx,
      mapcode: this.mapcode,
      area: this.area,
      position: { ...this.position },
    };
  }
}

export { Monster };
