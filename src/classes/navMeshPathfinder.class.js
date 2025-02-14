import { NavMesh, Vector3, NavMeshLoader } from 'yuka';

class NavMeshPathfinder {
  constructor() {
    this.navMesh = null;
    this.config = {
      movementSpeed: 5, // 일정한 이동 속도
      pathSmoothing: true, // 경로 스무딩 활성화
      cornerThreshold: 0.5, // 코너 감지 임계값
    };
    this.collisionAvoidance = new CollisionAvoidance();
  }

  async initializeNavMesh(navMeshData) {
    try {
      const loader = new NavMeshLoader();
      this.navMesh = await loader.load(navMeshData);
      console.log('NavMesh initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NavMesh:', error);
    }
  }

  calculatePath(startPos, targetPos) {
    if (!this.navMesh) {
      console.error('NavMesh not initialized');
      return null;
    }

    const start = new Vector3(startPos.x, startPos.y, startPos.z);
    const target = new Vector3(targetPos.x, targetPos.y, targetPos.z);

    // 기본 경로 계산
    const rawPath = this.navMesh.findPath(start, target);
    if (!rawPath) {
      return null;
    }

    // 경로 최적화
    return this.optimizePath(rawPath);
  }

  optimizePath(path) {
    if (path.length < 2) return path;

    const smoothedPath = [];
    smoothedPath.push(path[0]);

    // 경로 스무딩
    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const current = path[i];
      const next = path[i + 1];

      if (this.isSignificantCorner(prev, current, next)) {
        smoothedPath.push(current);
      }
    }

    smoothedPath.push(path[path.length - 1]);
    return this.addMovementData(smoothedPath);
  }

  isSignificantCorner(prev, current, next) {
    const v1 = new Vector3().subVectors(current, prev).normalize();
    const v2 = new Vector3().subVectors(next, current).normalize();
    const angle = v1.angleTo(v2);
    return angle > this.config.cornerThreshold;
  }

  addMovementData(path) {
    // 각 경로 포인트에 이동 데이터 추가
    return path.map((point, index) => {
      const nextPoint = path[index + 1];
      if (!nextPoint)
        return {
          position: point,
          direction: new Vector3(),
          speed: this.config.movementSpeed,
        };

      // 다음 포인트를 향하는 방향 벡터 계산
      const direction = new Vector3().subVectors(nextPoint, point).normalize();

      return {
        position: point,
        direction: direction,
        speed: this.config.movementSpeed, // 일정한 속도 유지
      };
    });
  }

  handlePlayerMovement(
    playerId,
    startPos,
    targetPos,
    otherPlayers,
    currentTime,
  ) {
    const initialPath = this.calculatePath(startPos, targetPos);
    if (!initialPath) return null; // 충돌 회피가 적용된 경로 계산
    const adjustedPath = this.collisionAvoidance.checkPathSegments(
      initialPath,
      otherPlayers,
      currentTime,
    );
    return this.addMovementData(adjustedPath);
  }

  adjustPathForCollisions(path, currentPlayerId) {
    const adjustedPath = [];
    const playerRadius = 1.0;

    for (const pathPoint of path) {
      let point = pathPoint.position || pathPoint;
      const players = playerSession.getPlayerAll();

      let needsAdjustment = false;
      for (const [playerId, playerInfo] of players.entries()) {
        if (playerId === currentPlayerId) continue;

        const playerPos = playerInfo.position;
        const distance = point.distanceTo(
          new Vector3(playerPos.x, playerPos.y, playerPos.z),
        );

        if (distance < playerRadius * 2) {
          point = this.findSafePoint(point, playerPos);
          needsAdjustment = true;
          break;
        }
      }

      adjustedPath.push(needsAdjustment ? point : pathPoint);
    }

    return adjustedPath;
  }

  findSafePoint(point, obstaclePos) {
    const direction = new Vector3()
      .copy(point)
      .sub(new Vector3(obstaclePos.x, obstaclePos.y, obstaclePos.z))
      .normalize();

    const safePoint = new Vector3()
      .copy(point)
      .add(direction.multiplyScalar(2.0));

    return this.navMesh.clampPoint(safePoint, new Vector3());
  }
}

export default NavMeshPathfinder;
