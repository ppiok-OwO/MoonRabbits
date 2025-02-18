import Entity from './stat.class.js'; // Entity 클래스를 가져옴
import payloadData from '../utils/packet/payloadData.js'; // 패킷 데이터 유틸리티 가져옴
import TransformInfo from './transformInfo.class.js'; // 위치 변환 정보 클래스를 가져옴

class Monster extends Entity {
  // Entity 클래스를 상속받는 Monster 클래스 정의
  constructor(
    monsterIdx, // 몬스터 인덱스
    monsterModel, // 몬스터 모델
    monsterName, // 몬스터 이름
    stat = payloadData.StatInfo(1, 100, 5, 5), // 기본 통계 정보
    navMesh, // 내비게이션 메쉬
  ) {
    super(stat); // 부모 클래스(Entity)의 생성자 호출
    this.idx = monsterIdx; // 몬스터 인덱스 저장
    this.model = monsterModel; // 몬스터 모델 저장
    this.name = monsterName; // 몬스터 이름 저장
    this.position = new TransformInfo(); // 위치 정보 초기화

    // AI 관련 속성 초기화
    this.navMesh = navMesh; // 내비게이션 메쉬 저장
    this.basePosition = null; // 기본 위치
    this.targetPlayer = null; // 타겟 플레이어
    this.path = []; // 이동 경로
    this.behaviorInterval = null; // 행동 업데이트 간격
    this.returnToBaseTimeout = null; // 기본 위치로 돌아가는 타임아웃
    this.isReturningToBase = false; // 기본 위치로 돌아가고 있는지 여부
    this.onMove = null; // 이동 이벤트 콜백

    // AI 설정값
    this.wanderRadius = 5; // 배회 반경
    this.viewDistance = 10; // 시야 거리
    this.viewAngle = Math.PI / 2; // 시야각 (90도)
    this.maxDistanceFromBase = 15; // 최대 이동 거리
    this.updateInterval = 1000; // 행동 업데이트 간격 (ms)
  }

  // 몬스터 상태 반환
  getMonsterStatus() {
    return payloadData.MonsterStatus(this.idx, this.model, this.name);
  }

  // 몬스터 통계 반환
  getMonsterStat() {
    return this.stat;
  }

  // 이동 이벤트 콜백 설정
  setMoveCallback(callback) {
    this.onMove = callback;
  }

  // AI 초기화 메서드
  initializeAI(startPosition) {
    this.basePosition = { ...startPosition }; // 기본 위치 설정
    this.position.setPosition(
      startPosition.x,
      startPosition.y,
      startPosition.z,
    ); // 현재 위치 설정
    this.startBehavior(); // 행동 시작
  }

  // 행동 시작 메서드
  startBehavior() {
    if (this.behaviorInterval) {
      clearInterval(this.behaviorInterval); // 기존 행동 간격 정리
    }
    this.behaviorInterval = setInterval(
      () => this.updateBehavior(), // 주기적으로 행동 업데이트
      this.updateInterval,
    );
  }

  // 행동 정지 메서드
  stopBehavior() {
    if (this.behaviorInterval) {
      clearInterval(this.behaviorInterval); // 행동 간격 정리
      this.behaviorInterval = null; // 간격 null로 설정
    }
  }

  // 두 위치 간 거리 계산
  calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dz = pos2.z - pos1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz); // 유클리드 거리 계산
  }

  // 기본 위치 범위 내에 있는지 확인
  isWithinBaseRange() {
    const currentPos = {
      x: this.position.posX,
      y: this.position.posY,
      z: this.position.posZ,
    };
    return (
      this.calculateDistance(currentPos, this.basePosition) <=
      this.maxDistanceFromBase // 범위 확인
    );
  }

  // 플레이어가 몬스터 시야 내에 있는지 확인
  isPlayerInView(player) {
    const monsterPos = {
      x: this.position.posX,
      y: this.position.posY,
      z: this.position.posZ,
    };

    const playerPos = {
      x: player.position.posX,
      y: player.position.posY,
      z: player.position.posZ,
    };

    return isPlayerWithInMonsterView(
      // 시야 내 플레이어 확인
      monsterPos,
      this.position.rot,
      this.viewAngle,
      this.viewDistance,
      playerPos,
    );
  }

  // 시야 내 모든 플레이어 반환
  getPlayersInView() {
    const playerSession = getPlayerSession(); // 플레이어 세션 가져오기
    const players = playerSession.getAllPlayers(); // 모든 플레이어 가져오기
    return players.filter((player) => this.isPlayerInView(player)); // 시야 내 플레이어 필터링
  }

  // 랜덤 배회 위치 생성
  getRandomWanderPosition() {
    const angle = Math.random() * 2 * Math.PI; // 랜덤 각도
    const radius = Math.random() * this.wanderRadius; // 랜덤 반경
    return {
      x: this.basePosition.x + radius * Math.cos(angle), // x좌표
      y: this.basePosition.y, // y좌표
      z: this.basePosition.z + radius * Math.sin(angle), // z좌표
    };
  }

  // 기본 위치로 돌아가는 처리
  async handleReturnToBase() {
    if (this.returnToBaseTimeout) {
      clearTimeout(this.returnToBaseTimeout); // 기존 타임아웃 정리
    }

    if (!this.isWithinBaseRange()) {
      this.isReturningToBase = true; // 기본 위치로 돌아가는 상태
      this.returnToBaseTimeout = setTimeout(async () => {
        await this.moveToPosition(this.basePosition); // 기본 위치로 이동
        this.isReturningToBase = false; // 돌아온 후 상태 초기화
        this.targetPlayer = null; // 타겟 플레이어 초기화
      }, 3000); // 3초 후 실행
    }
  }

  // 특정 위치로 이동
  async moveToPosition(targetPos) {
    const currentPos = {
      x: this.position.posX,
      y: this.position.posY,
      z: this.position.posZ,
    };

    const path = await findPath(this.navMesh, currentPos, targetPos); // 경로 찾기

    if (path.length > 1) {
      this.path = path; // 경로 저장
      this.position.setPosition(currentPos.x, currentPos.y, currentPos.z); // 현재 위치 설정

      // 이동 이벤트 발생
      if (this.onMove) {
        this.onMove({
          monsterId: this.idx,
          path: path,
          startPos: currentPos,
          targetPos: targetPos,
        });
      }

      return true; // 성공적으로 이동
    }
    return false; // 이동 실패
  }

  // 행동 업데이트 메서드
  async updateBehavior() {
    const playersInView = this.getPlayersInView(); // 시야 내 플레이어 확인

    if (playersInView.length > 0) {
      // 시야 내 플레이어가 있을 경우
      if (!this.targetPlayer || !this.isPlayerInView(this.targetPlayer)) {
        // 새로운 타겟 랜덤 선택
        const randomIndex = Math.floor(Math.random() * playersInView.length);
        this.targetPlayer = playersInView[randomIndex];
      }

      // 타겟 플레이어 추적
      const targetPos = {
        x: this.targetPlayer.position.posX,
        y: this.targetPlayer.position.posY,
        z: this.targetPlayer.position.posZ,
      };

      await this.moveToPosition(targetPos); // 타겟 위치로 이동

      // 기본 위치에서 너무 멀어졌는지 확인
      if (!this.isWithinBaseRange()) {
        await this.handleReturnToBase(); // 기본 위치로 돌아가기 처리
      }
    } else {
      // 시야 내 플레이어가 없을 경우
      if (!this.isReturningToBase) {
        // 배회 행동
        const wanderPos = this.getRandomWanderPosition(); // 랜덤 배회 위치
        await this.moveToPosition(wanderPos); // 배회 위치로 이동
      }
    }
  }

  // 설정값 변경 메서드들
  setWanderRadius(radius) {
    this.wanderRadius = radius; // 배회 반경 설정
  }

  setViewDistance(distance) {
    this.viewDistance = distance; // 시야 거리 설정
  }

  setViewAngle(angle) {
    this.viewAngle = angle; // 시야각 설정
  }

  setMaxDistanceFromBase(distance) {
    this.maxDistanceFromBase = distance; // 최대 이동 거리 설정
  }

  setUpdateInterval(interval) {
    this.updateInterval = interval; // 업데이트 간격 설정
    if (this.behaviorInterval) {
      this.stopBehavior();
      this.startBehavior(); // 기존 행동 정지 후 새 간격으로 행동 시작
    }
  }
}

export default Monster; // Monster 클래스를 모듈로 내보냄
