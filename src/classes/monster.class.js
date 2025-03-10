import { config } from '../config/config.js';
import { findPath } from '../init/navMeshLoader.js';
import makePacket from '../utils/packet/makePacket.js';
import PAYLOAD from '../utils/packet/payload.js';
import PAYLOAD_DATA from '../utils/packet/payloadData.js';
import { getPartySessions, getSectorSessions } from '../session/sessions.js';
import { getNaveMesh } from '../init/navMeshData.js';
import PACKET from '../utils/packet/packet.js';
import moveSectorHandler from '../handlers/transport/moveSectorHandler.js';
import delay from '../utils/delay.js';

class Monster {
  constructor(sectorCode, monsterIdx, area) {
    this.sectorCode = sectorCode; // 맵 코드 - 어느 섹터에 있는지
    this.monsterIdx = monsterIdx; // 몬스터 ID - 어떤 몬스터인지 구분
    this.navMesh = getNaveMesh(sectorCode);
    this.moveSpeed = 5; // 이동 속도
    this.lastUpdateTime = 0; // 마지막 업데이트 시간
    this.updateInterval = 100; // 10프레임 간격으로 위치 업데이트
    this.position = { x: 0, y: 0, z: 0 }; // 기본값으로 초기화

    // 패킷 전송 관련 새로운 속성 추가
    this.lastPacketSentTime = 0; // 마지막 패킷 전송 시간
    this.positionChanged = false; // 위치 변경 여부 플래그
    this.stateChanged = false; // 상태 변경 여부 플래그 (공격 등)

    // area가 제공되면 위치 초기화
    if (area && area.position) {
      this.position = {
        x: area.position.x || 0,
        y: area.position.y || 0,
        z: area.position.z || 0,
      };
    }

    this.homePosition = { ...this.position };
    this.roamingRange = 12; // 배회 범위
    this.currentPath = []; // 현재 이동 경로
    this.pathIndex = 0; // 현재 경로에서의 위치
    this.stepSize = 10; // 경로 보간 간격

    // 플레이어 추적 관련 속성
    this.detectionRadius = 8; // 플레이어 감지 반경
    this.targetPlayer = null; // 현재 타겟팅 중인 플레이어
    this.lastPlayerContactTime = 0; // 마지막으로 플레이어와 접촉한 시간
    this.playerLostTimeout = 3000; // 플레이어를 잃은 후 홈으로 돌아가기까지의 시간 (3초)

    // 공격 관련 속성
    this.isAttacking = false; // 공격 중인지 여부
    this.attackDuration = 1000; // 공격 지속 시간
    this.attackStartTime = 0; // 공격 시작 시간

    // 스턴 관련 속성
    this.isSturn = false; // 스턴 중인지 여부
    this.sturnDuration = 2000; // 스턴 지속 시간
    this.sturnStartTime = 0; // 스턴 시작 시간

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

    // x/z와 posX/posZ 형식 모두 처리
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

    // x/z와 posX/posZ 형식 모두 처리
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

    // x/z와 posX/posZ 형식 모두 처리
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

    // 내적 계산
    const dotProduct =
      this.direction.x * normalizedToPlayer.x +
      this.direction.z * normalizedToPlayer.z;

    // 내적이 0보다 크면 플레이어는 몬스터의 전방에 있음
    return dotProduct > 0;
  }

  // 가장 가까운 플레이어 찾기
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

        // 플레이어 위치
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
  async startAttack(targetPlayerObj) {
    if (!this.isAttacking && targetPlayerObj.getHp() > 0) {
      this.isAttacking = true;
      this.attackStartTime = Date.now();
      this.stateChanged = true; // 상태 변경 플래그 설정

      // 플레이어 체력 변화
      const changedHp = targetPlayerObj.getHp() - 1;
      const resultHp = targetPlayerObj.setHp(changedHp); // setHp 메서드 내부에서 음수일 경우 예외처리가 들어감

      // 만약 파티 중이라면 멤버 카드 UI 업데이트
      const partySession = getPartySessions();
      const partyId = targetPlayerObj.getPartyId();
      if (partyId) {
        const party = partySession.getParty(partyId);
        const members = party.getAllMembers();

        members.forEach((value, key) => {
          const partyPacket = PACKET.S2CUpdateParty(
            party.getId(),
            party.getPartyLeaderId(),
            party.getMemberCount(),
            party.getAllMemberCardInfo(value.id),
          );
          key.write(partyPacket);
        });
      }

      if (resultHp <= 0) {
        await delay(3000);

        // 마을로 이동할 땐 피를 복구해줘야 함(부활)
        targetPlayerObj.setHp(config.newPlayerStatData.hp);

        const socket = targetPlayerObj.user.getSocket();
        moveSectorHandler(socket, { targetSector: 100 });

        // 마을로 이동할 땐 파티 목록 업데이트 해주기
        // 만약 파티 중이라면 멤버 카드 UI 업데이트
        const partySession = getPartySessions();
        const partyId = targetPlayerObj.getPartyId();
        if (partyId) {
          const party = partySession.getParty(partyId);
          const members = party.getAllMembers();

          members.forEach((value, key) => {
            const partyPacket = PACKET.S2CUpdateParty(
              party.getId(),
              party.getPartyLeaderId(),
              party.getMemberCount(),
              party.getAllMemberCardInfo(value.id),
            );
            key.write(partyPacket);
          });
        }
      }
    }
  }
  startSturn(duration) {
    if (!this.isSturn) {
      this.isSturn = true;
      this.sturnDuration = duration * 1000;
      this.sturnStartTime = Date.now();
      this.stateChanged = true;
    }
  }

  // 공격 종료 함수
  endAttack() {
    if (this.isAttacking) {
      this.isAttacking = false;
      this.stateChanged = true; // 상태 변경 플래그 설정
    }
  }

  // 스턴 종료 함수
  endSturn() {
    if (this.isSturn) {
      this.isSturn = false;
      this.stateChanged = true;
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

  //스턴 상태 업데이트
  updateSturnState(currentTime) {
    if (
      this.isSturn &&
      currentTime - this.sturnStartTime >= this.sturnDuration
    ) {
      this.endSturn();
    }
  }

  // 클라이언트로부터 충돌 패킷 처리 함수
  handleCollisionPacket(data) {
    // 충돌 시 공격 시작 (이동 중지 2초)
    // null 체크
    this.startAttack(this.targetPlayer.player);

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

    // 충돌 시 강제로 패킷 전송 - 즉시 상태 업데이트를 위해
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

      const path = await findPath(
        this.navMesh,
        this.position,
        adjustedTarget,
        this.stepSize,
      );

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
    if (this.isAttacking || this.isSturn) {
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

    // 이동 전 위치 저장
    const prevPos = { ...this.position };

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

    // 위치가 변경되었는지 체크
    if (
      Math.abs(this.position.x - prevPos.x) > 0.01 ||
      Math.abs(this.position.z - prevPos.z) > 0.01
    ) {
      this.positionChanged = true;
    }

    return false; // 아직 이동 중
  }

  // 플레이어 추적 관련 로직 업데이트
  async updatePlayerTracking(currentTime) {
    // 공격 중이면 플레이어 추적 로직 건너뜀
    if (this.isAttacking || this.isSturn) {
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
            // this.startAttack(targetPlayerObj);
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

  async getUpdateInfo(currenTime) {
    try {
      const updateInfo = PAYLOAD_DATA.MonsterInfo(
        this.monsterIdx,
        this.position.x,
        this.position.z,
      );
      return updateInfo;
    } catch (err) {
      console.error(
        `몬스터 ${this.monsterIdx} 정보 가져오는 중 오류 발생 ${err}`,
      );
    }
  }

  // 별도 패킷 생성 함수 - 패킷 전송 로직을 업데이트에서 분리
  async createPacket(currentTime) {
    try {
      const monsterInfo = this.getUpdateInfo(currentTime);

      // 패킷 전송 시간 기록
      this.lastPacketSentTime = currentTime;

      // 디버깅 정보 - 위치나 상태가 변경되었을 때만 출력
      if (this.positionChanged || this.stateChanged) {
        // console.log(
        //   `몬스터 ${this.monsterIdx} 업데이트: 위치(${this.position.x.toFixed(2)}, ${this.position.z.toFixed(2)}), 공격중: ${this.isAttacking}, 시간: ${Data.now()}`,
        // );

        // 패킷 생성 후 변경 상태 초기화
        this.positionChanged = false;
        this.stateChanged = false;
      }

      return monsterInfo;
    } catch (error) {
      console.error(`몬스터 ${this.monsterIdx} 패킷 생성 중 오류 발생:`, error);
      return null;
    }
  }

  // 몬스터 업데이트 함수 - 패킷 전송 로직 제거
  async update(currentTime, shouldSendPacket = false) {
    const deltaTime = currentTime - this.lastUpdateTime;
    if (deltaTime < this.updateInterval) {
      return null;
    }

    // 업데이트 시간 기록
    this.lastUpdateTime = currentTime;

    // 이전 상태 백업
    const prevIsAttacking = this.isAttacking;
    const prevIsSturn = this.isSturn;
    const prevPosition = { ...this.position };

    try {
      // 공격 상태 업데이트
      this.updateAttackState(currentTime);
      // 스턴 상태 업데이트
      this.updateSturnState(currentTime);

      // 공격 상태 변경 감지
      if (prevIsAttacking !== this.isAttacking) {
        this.stateChanged = true;
      }

      // 스턴 상태 변경 감지
      if (prevIsSturn !== this.isSturn) {
        this.stateChanged = true;
      }

      // 공격 중이 아닐 때만 플레이어 추적 및 이동 로직 실행
      if (!this.isAttacking || !this.isSturn) {
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
          // NavMesh에 기반한 유효한 랜덤 위치를 찾을 때까지 시도
          let validPath = false;
          let attempts = 0;
          const maxAttempts = 5; // 최대 시도 횟수

          while (!validPath && attempts < maxAttempts) {
            // 새로운 랜덤 위치 설정
            const randomAngle = Math.random() * Math.PI * 2; // 360도 전 범위
            // 시도가 실패할수록 더 작은 범위에서 찾음
            const rangeFactor = 1 - attempts * 0.15; // 시도할 때마다 15%씩 범위 축소
            const randomDist =
              this.roamingRange * 0.3 +
              Math.random() * this.roamingRange * 0.7 * rangeFactor;

            const randomTarget = {
              x: this.homePosition.x + Math.cos(randomAngle) * randomDist,
              y: this.homePosition.y,
              z: this.homePosition.z + Math.sin(randomAngle) * randomDist,
            };

            // 경로 계산 시도
            const path = await this.calculatePath(randomTarget);
            validPath = path; // calculatePath에서 true/false를 반환하도록 설정
            attempts++;
          }

          // 모든 시도가 실패하면 홈 위치로 돌아가도록 함
          if (!validPath) {
            await this.calculatePath(this.homePosition);
          }
        }

        // 이동 실행
        this.moveAlongPath(deltaTime);
      }

      // 위치 변경 감지
      if (
        Math.abs(prevPosition.x - this.position.x) > 0.01 ||
        Math.abs(prevPosition.z - this.position.z) > 0.01
      ) {
        this.positionChanged = true;
      }
    } catch (error) {
      console.error(`몬스터 ${this.monsterIdx} 업데이트 중 오류 발생:`, error);
      // 오류 발생 시 홈 위치로 설정
      this.position = { ...this.homePosition };
      this.targetPlayer = null;
      this.currentPath = [];
      this.pathIndex = 0;
    }

    return null; // 업데이트는 패킷을 반환하지 않음
  }
}

export default Monster;
