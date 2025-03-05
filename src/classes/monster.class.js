import { config } from '../config/config.js';
import { findPath, loadNavMesh } from '../init/navMeshLoader.js';
import makePacket from '../utils/packet/makePacket.js';
import PAYLOAD from '../utils/packet/payload.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { getSectorSessions } from '../session/sessions.js';
import { getNavMesh } from '../init/navMeshData.js';
import { performance, PerformanceObserver } from 'perf_hooks';

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries());
});
obs.observe({ entryTypes: ['measure'] });

class Monster {
  constructor(sectorCode, monsterIdx, area) {
    this.sectorCode = sectorCode; // 맵 코드 - 어느 섹터에 있는지
    this.monsterIdx = monsterIdx; // 몬스터 ID - 어떤 몬스터인지 구분
    this.navMesh = getNavMesh(sectorCode);
    this.moveSpeed = 7; // 이동 속도
    this.anglerSpeed = 150; // 회전 속도
    this.acc = 10; // 가속도
    this.lastUpdateTime = 0; // 마지막 업데이트 시간
    this.updateInterval = 100; // 10프레임 (100ms) 간격으로 위치 업데이트
    this.position = { x: 0, y: 0, z: 0 }; // 기본값으로 초기화

    // area가 제공되면 위치 초기화
    if (area && area.position) {
      this.position = {
        x: area.position.x || 0,
        y: area.position.y || 0,
        z: area.position.z || 0,
      };
    }

    this.homePosition = { ...this.position };
    this.roamingRange = 45; // 배회 범위 (-45 ~ +45)
    this.currentPath = []; // 현재 이동 경로
    this.pathIndex = 0; // 현재 경로에서의 위치
    this.stepSize = 10; // 경로 보간 간격

    // 플레이어 추적 관련 속성
    this.detectionRadius = 16; // 플레이어 감지 반경
    this.targetPlayer = null; // 현재 타겟팅 중인 플레이어
    this.lastPlayerContactTime = 0; // 마지막으로 플레이어와 접촉한 시간
    this.playerLostTimeout = 3000; // 플레이어를 잃은 후 홈으로 돌아가기까지의 시간 (3초)

    // 공격 관련 속성
    this.isAttacking = false; // 공격 중인지 여부
    this.attackDuration = 2000; // 공격 지속 시간 (2초)
    this.attackStartTime = 0; // 공격 시작 시간

    // 움직임 방향 저장
    this.direction = { x: 0, z: 0 };
  }

  // 몬스터 초기 위치 설정
  initialize(areaData) {
    if (!areaData) return;

    // 직접 위치 객체와 중첩된 위치 속성 모두 처리
    if (
      areaData.x !== undefined &&
      areaData.y !== undefined &&
      areaData.z !== undefined
    ) {
      this.homePosition = { x: areaData.x, y: areaData.y, z: areaData.z };
      this.position = { x: areaData.x, y: areaData.y, z: areaData.z };
    } else if (areaData.position) {
      this.homePosition = { ...areaData.position };
      this.position = { ...areaData.position };
    }
  }

  // 홈 위치와의 거리 계산
  getDistanceToHome() {
    const dx = this.position.x - this.homePosition.x;
    const dz = this.position.z - this.homePosition.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  // 두 위치 사이의 거리 계산
  getDistance(pos1, pos2) {
    if (!pos1 || !pos2) return Infinity;

    // x/y/z와 posX/posY/posZ 형식 모두 처리
    const x1 =
      pos1.x !== undefined ? pos1.x : pos1.posX !== undefined ? pos1.posX : 0;
    const z1 =
      pos1.z !== undefined ? pos1.z : pos1.posZ !== undefined ? pos1.posZ : 0;
    const x2 =
      pos2.x !== undefined ? pos2.x : pos2.posX !== undefined ? pos2.posX : 0;
    const z2 =
      pos2.z !== undefined ? pos2.z : pos2.posZ !== undefined ? pos2.posZ : 0;

    const dx = x1 - x2;
    const dz = z1 - z2;
    return Math.sqrt(dx * dx + dz * dz);
  }

  // 움직임 방향 계산 및 업데이트
  updateDirection(targetPos) {
    if (!targetPos) return;

    // x/y/z와 posX/posY/posZ 형식 모두 처리
    const targetX =
      targetPos.x !== undefined
        ? targetPos.x
        : targetPos.posX !== undefined
          ? targetPos.posX
          : 0;
    const targetZ =
      targetPos.z !== undefined
        ? targetPos.z
        : targetPos.posZ !== undefined
          ? targetPos.posZ
          : 0;

    const dx = targetX - this.position.x;
    const dz = targetZ - this.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 0) {
      this.direction = {
        x: dx / distance,
        z: dz / distance,
      };
    }
  }

  // 몬스터가 자신의 구역을 벗어났는지 확인
  isOutOfBounds() {
    return this.getDistanceToHome() > this.roamingRange;
  }

  // 타겟 플레이어가 몬스터의 전방에 있는지 확인
  isPlayerInFront(playerPos) {
    if (!playerPos || !this.direction) return false;

    // x/y/z와 posX/posY/posZ 형식 모두 처리
    const playerX =
      playerPos.x !== undefined
        ? playerPos.x
        : playerPos.posX !== undefined
          ? playerPos.posX
          : 0;
    const playerZ =
      playerPos.z !== undefined
        ? playerPos.z
        : playerPos.posZ !== undefined
          ? playerPos.posZ
          : 0;

    // 몬스터에서 플레이어로의 벡터
    const toPlayer = {
      x: playerX - this.position.x,
      z: playerZ - this.position.z,
    };

    // 벡터 정규화
    const distance = Math.sqrt(
      toPlayer.x * toPlayer.x + toPlayer.z * toPlayer.z,
    );
    if (distance === 0) return true; // 같은 위치에 있으면 전방으로 간주

    const normalizedToPlayer = {
      x: toPlayer.x / distance,
      z: toPlayer.z / distance,
    };

    // 내적 계산 (두 방향 벡터의 유사도)
    const dotProduct =
      this.direction.x * normalizedToPlayer.x +
      this.direction.z * normalizedToPlayer.z;

    // 내적이 0보다 크면 플레이어는 몬스터의 전방에 있음
    return dotProduct > 0;
  }

  // 가장 가까운 플레이어 찾기 (범위 내에 있는 플레이어 중)
  findNearestPlayer() {
    try {
      // 섹터의 모든 플레이어 가져오기
      const players = getSectorSessions().getAllPlayerByCode(this.sectorCode);

      if (!players || players.length === 0) {
        return null;
      }

      let nearestPlayer = null;
      let nearestDistance = Infinity;

      // 각 플레이어에 대해 처리
      for (const player of players) {
        if (!player) continue;

        // 플레이어 위치 안전하게 가져오기
        let playerPos = null;

        // 여러 방법으로 플레이어 위치 가져오기 시도
        if (typeof player.getPosition === 'function') {
          playerPos = player.getPosition();
        } else if (player.position) {
          playerPos = player.position;
        } else if (player.posX !== undefined) {
          playerPos = {
            x: player.posX,
            y: player.posY,
            z: player.posZ,
          };
        } else if (player.transform && player.transform.position) {
          playerPos = player.transform.position;
        }

        if (!playerPos) continue;

        // 거리 계산
        const distance = this.getDistance(this.position, playerPos);

        // 감지 범위 내에 있는지 확인
        const isInDetectionRadius = distance < this.detectionRadius;

        // 전방에 있는지 확인
        const isInFront = this.isPlayerInFront(playerPos);

        // 탐지 조건을 모두 만족하는지 확인
        if (isInDetectionRadius && isInFront && distance < nearestDistance) {
          nearestDistance = distance;
          nearestPlayer = {
            player: player,
            position: playerPos,
            distance: distance,
          };
        }
      }

      return nearestPlayer;
    } catch (error) {
      console.error('플레이어 탐지 중 오류 발생:', error);
      return null;
    }
  }

  // 공격 시작 함수
  startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.attackStartTime = Date.now();
      // 클라이언트에서 충돌 패킷을 보내므로 별도의 공격 알림 패킷은 필요 없음
    }
  }

  // 공격 종료 함수
  endAttack() {
    if (this.isAttacking) {
      this.isAttacking = false;
    }
  }

  // 공격 상태 업데이트
  updateAttackState(currentTime) {
    if (
      this.isAttacking &&
      currentTime - this.attackStartTime >= this.attackDuration
    ) {
      this.endAttack();
    }
  }

  // 클라이언트로부터 충돌 패킷 처리 함수
  handleCollisionPacket(data) {
    // 충돌 시 공격 시작 (이동 중지 2초)
    this.startAttack();

    // 타겟 플레이어 설정 (이미 설정되어 있을 수 있음)
    if (!this.targetPlayer && data && data.playerId) {
      try {
        const sector = getSectorSessions().getSectorByCode(this.sectorCode);
        if (!sector) return false;

        const player = sector.getPlayer(data.playerId);
        if (!player) return false;

        let playerPos = null;

        // 여러 방법으로 플레이어 위치 가져오기 시도
        if (typeof player.getPosition === 'function') {
          playerPos = player.getPosition();
        } else if (player.position) {
          playerPos = player.position;
        } else if (player.posX !== undefined) {
          playerPos = {
            x: player.posX,
            y: player.posY,
            z: player.posZ,
          };
        }

        if (playerPos) {
          this.targetPlayer = {
            player: player,
            position: playerPos,
            distance: this.getDistance(this.position, playerPos),
          };
          this.lastPlayerContactTime = Date.now();
        }
      } catch (error) {
        console.error('타겟 플레이어 설정 중 오류 발생:', error);
      }
    }

    // 필요한 경우 충돌에 대한 응답 패킷 전송
    try {
      const transformInfo = PAYLOAD_DATA.TransformInfo(
        this.position.x,
        this.position.y,
        this.position.z,
        0,
      );
      const monsterInfo = PAYLOAD.S2CMonsterLocation(
        this.monsterIdx,
        transformInfo,
      );
      const packet = makePacket(
        config.packetId.S2CMonsterLocation,
        monsterInfo,
      );

      const sector = getSectorSessions().getSectorByCode(this.sectorCode);
      if (sector) {
        sector.notify(packet);
      }
    } catch (error) {
      console.error('충돌 응답 패킷 전송 중 오류 발생:', error);
    }

    return true; // 충돌 처리 성공
  }

  async calculatePath(targetPosition) {
    try {
      if (!targetPosition) return false;

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

      performance.mark('start');
      const path = await findPath(
        this.navMesh,
        this.position,
        adjustedTarget,
        this.stepSize,
      );
      performance.mark('end');
      performance.measure('몬스터 경로 계산 시간', 'start', 'end');

      // 경로를 찾지 못하면 현재 위치에서 홈으로 복귀 경로 계산
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

        this.currentPath = homewardPath;
        this.pathIndex = 0;
        return true;
      }

      this.currentPath = path;
      this.pathIndex = 0;
      return true;
    } catch (error) {
      console.error('경로 찾기 오류:', error);
      // 에러 발생시 현재 위치 정지
      this.currentPath = [];
      this.pathIndex = 0;
      return false;
    }
  }

  // 경로를 따라 이동
  moveAlongPath(deltaTime) {
    // 공격 중이면 이동하지 않음
    if (this.isAttacking) {
      return false;
    }

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
    const movement = this.moveSpeed * (deltaTime / 1000);
    const ratio = Math.min(movement / distance, 1);

    this.position = {
      x: this.position.x + dx * ratio,
      y: this.position.y,
      z: this.position.z + dz * ratio,
    };

    // 이동 방향 업데이트
    this.updateDirection(targetPoint);

    return false; // 아직 이동 중
  }

  // 플레이어 추적 관련 로직 업데이트
  async updatePlayerTracking(currentTime) {
    // 공격 중이면 플레이어 추적 로직 건너뜀
    if (this.isAttacking) {
      return;
    }

    // 현재 타겟 플레이어가 있으면 위치 확인
    if (this.targetPlayer && this.targetPlayer.player) {
      const targetPlayerObj = this.targetPlayer.player;
      let currentPlayerPos = null;

      // 현재 플레이어 위치 가져오기 시도
      try {
        if (typeof targetPlayerObj.getPosition === 'function') {
          currentPlayerPos = targetPlayerObj.getPosition();
        } else if (targetPlayerObj.position) {
          currentPlayerPos = targetPlayerObj.position;
        } else if (targetPlayerObj.posX !== undefined) {
          currentPlayerPos = {
            x: targetPlayerObj.posX,
            y: targetPlayerObj.posY,
            z: targetPlayerObj.posZ,
          };
        }
      } catch (error) {
        console.error('플레이어 위치 가져오기 오류:', error);
      }

      if (currentPlayerPos) {
        const calculatedDistance = this.getDistance(
          this.position,
          currentPlayerPos,
        );

        // 플레이어가 여전히 감지 범위 내에 있는 경우
        if (calculatedDistance < this.detectionRadius) {
          this.lastPlayerContactTime = currentTime;
          this.targetPlayer.position = currentPlayerPos;
          this.targetPlayer.distance = calculatedDistance;

          // 경로 재계산 (매 업데이트마다 하지 않고, 일정 거리 이상 차이가 날 때만 수행하면 성능 개선 가능)
          if (
            this.pathIndex >= this.currentPath.length - 1 ||
            this.getDistance(
              this.currentPath[this.pathIndex] || { x: 0, z: 0 },
              currentPlayerPos,
            ) > 5
          ) {
            await this.calculatePath(currentPlayerPos);
          }

          // 플레이어와 충분히 가까우면 공격 시작
          if (calculatedDistance < 1) {
            this.startAttack();
          }

          return;
        }
      }

      // 플레이어를 감지할 수 없는 경우 타이머 체크
      if (currentTime - this.lastPlayerContactTime < this.playerLostTimeout) {
        // 아직 타임아웃 전이므로 마지막 알려진 위치로 계속 이동
        return;
      } else {
        // 타임아웃 이후에는 타겟 해제 및 홈으로 복귀
        this.targetPlayer = null;
        await this.calculatePath(this.homePosition);
      }
    }

    // 타겟 플레이어가 없는 경우 새로운 플레이어 탐색
    const nearestPlayer = this.findNearestPlayer();
    if (nearestPlayer) {
      this.targetPlayer = nearestPlayer;
      this.lastPlayerContactTime = currentTime;
      await this.calculatePath(nearestPlayer.position);
    }
  }

  // 몬스터 업데이트 함수
  async update(currentTime) {
    const deltaTime = currentTime - this.lastUpdateTime;
    if (deltaTime < this.updateInterval) {
      return null;
    }
    this.lastUpdateTime = currentTime;

    try {
      // 공격 상태 업데이트 (2초 후 공격 상태 해제)
      this.updateAttackState(currentTime);

      // 공격 중이 아닐 때만 플레이어 추적 및 이동 로직 실행
      if (!this.isAttacking) {
        // 플레이어 추적 로직 업데이트
        await this.updatePlayerTracking(currentTime);

        // 현재 홈으로부터의 거리 체크
        const currentDistanceToHome = this.getDistanceToHome();

        // 홈 범위를 벗어났고 타겟 플레이어가 없는 경우 홈으로 복귀
        if (currentDistanceToHome > this.roamingRange && !this.targetPlayer) {
          await this.calculatePath(this.homePosition);
        }

        // 타겟 플레이어가 없고 경로도 없는 경우 새로운 랜덤 위치 설정
        if (
          !this.targetPlayer &&
          (!this.currentPath || this.pathIndex >= this.currentPath.length)
        ) {
          // 새로운 랜덤 위치 설정
          const randomAngle = Math.random() * Math.PI * 2; // 360도 전 범위
          const randomDist =
            this.roamingRange * 0.3 + Math.random() * this.roamingRange * 0.7; // 최소 30% ~ 최대 100% 범위

          const randomTarget = {
            x: this.homePosition.x + Math.cos(randomAngle) * randomDist,
            y: this.homePosition.y,
            z: this.homePosition.z + Math.sin(randomAngle) * randomDist,
          };

          await this.calculatePath(randomTarget);
        }

        // 이동 실행
        this.moveAlongPath(deltaTime);
      }

      // 현재 위치 패킷 전송
      const transformInfo = PAYLOAD_DATA.TransformInfo(
        this.position.x,
        this.position.y,
        this.position.z,
        0,
      );
      const monsterInfo = PAYLOAD.S2CMonsterLocation(
        this.monsterIdx,
        transformInfo,
      );
      const packet = makePacket(
        config.packetId.S2CMonsterLocation,
        monsterInfo,
      );

      const sector = getSectorSessions().getSectorByCode(this.sectorCode);
      if (sector) {
        sector.notify(packet);
      }
    } catch (error) {
      console.error('몬스터 업데이트 오류:', error);
      this.position = { ...this.homePosition };
    }
  }

  // 업데이트 패킷 생성
  createUpdatePacket() {
    return {
      id: this.monsterIdx,
      sectorCode: this.sectorCode,
      position: { ...this.position },
      isAttacking: this.isAttacking,
    };
  }
}

export default Monster;
