import { NavMesh, Vector3, NavMeshLoader } from 'yuka';

class NavMeshPathfinder {
  constructor() {
    this.navMesh = null;
    this.config = {
      movementSpeed: 5, // 일정한 이동 속도
      playerRadius: 1.0, // 플레이어 충돌 반경
      safetyMargin: 0.5, // 추가 안전 거리
    };
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

  // 기존 서버 패킷 구조에 맞춘 이동 처리
  handlePlayerMovement(
    startPosX,
    startPosY,
    startPosZ,
    targetPosX,
    targetPosY,
    targetPosZ,
  ) {
    if (!this.navMesh) {
      console.error('NavMesh not initialized');
      return null;
    }

    // YUKA Vector3로 변환
    const startPos = new Vector3(startPosX, startPosY, startPosZ);
    const targetPos = new Vector3(targetPosX, targetPosY, targetPosZ);

    // 경로 계산
    const path = this.navMesh.findPath(startPos, targetPos);

    if (!path) {
      console.error('No valid path found');
      return null;
    }

    // 경로의 각 점을 서버 형식으로 변환
    return this.convertPathToServerFormat(path);
  }

  // YUKA Vector3 경로를 서버 형식으로 변환
  convertPathToServerFormat(path) {
    return path.map((point) => ({
      posX: point.x,
      posY: point.y,
      posZ: point.z,
    }));
  }

  // 충돌 체크 (기존 서버 좌표 형식 사용)
  checkCollision(posX, posY, posZ, otherPlayers) {
    const position = new Vector3(posX, posY, posZ);

    for (const player of otherPlayers) {
      const otherPos = new Vector3(player.posX, player.posY, player.posZ);
      const distance = position.distanceTo(otherPos);

      if (distance < this.config.playerRadius * 2 + this.config.safetyMargin) {
        return true; // 충돌 발생
      }
    }

    return false; // 충돌 없음
  }

  // 안전한 위치 찾기 (기존 서버 좌표 형식 사용)
  findSafePoint(posX, posY, posZ, obstacles) {
    const position = new Vector3(posX, posY, posZ);
    let safePoint = position.clone();

    for (const obstacle of obstacles) {
      const obstaclePos = new Vector3(
        obstacle.posX,
        obstacle.posY,
        obstacle.posZ,
      );
      const direction = position.clone().sub(obstaclePos).normalize();

      safePoint.add(direction.multiplyScalar(this.config.safetyMargin));
    }

    // NavMesh 경계 내로 조정
    const clampedPoint = this.navMesh.clampPoint(safePoint, new Vector3());

    return {
      posX: clampedPoint.x,
      posY: clampedPoint.y,
      posZ: clampedPoint.z,
    };
  }

  // 경로 최적화
  optimizePath(path) {
    if (path.length < 3) return path;

    const optimizedPath = [path[0]];
    let currentPoint = path[0];
    let index = 1;

    while (index < path.length) {
      let checkPoint = path[index];
      let canSkip = true;

      // 현재 점에서 다음 점까지 직선 경로 가능 여부 확인
      for (let i = index + 1; i < path.length; i++) {
        if (!this.hasLineOfSight(currentPoint, path[i])) {
          canSkip = false;
          break;
        }
      }

      if (canSkip) {
        currentPoint = checkPoint;
        optimizedPath.push(checkPoint);
        index += 2;
      } else {
        currentPoint = path[index];
        optimizedPath.push(path[index]);
        index++;
      }
    }

    // 마지막 점 추가
    if (
      path.length > 0 &&
      optimizedPath[optimizedPath.length - 1] !== path[path.length - 1]
    ) {
      optimizedPath.push(path[path.length - 1]);
    }

    return optimizedPath;
  }

  // 두 점 사이 직선 경로 가능 여부 확인
  hasLineOfSight(startPoint, endPoint) {
    const start = new Vector3(
      startPoint.posX,
      startPoint.posY,
      startPoint.posZ,
    );
    const end = new Vector3(endPoint.posX, endPoint.posY, endPoint.posZ);

    return this.navMesh.checkLineOfSight(start, end);
  }
}

export default NavMeshPathfinder;
