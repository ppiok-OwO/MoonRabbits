import { Vector3 } from 'yuka';

class CollisionAvoidance {
  constructor() {
    this.config = {
      playerRadius: 1.0, // 플레이어 충돌 반경
      safetyMargin: 0.5, // 추가 안전 거리
      predictionTime: 0.5, // 미래 위치 예측 시간 (초)
      maxDeviationDistance: 3.0, // 최대 회피 거리
    };
  }

  // 충돌 예측을 통한 경로 조정
  checkFutureCollision(currentPos, targetPos, otherPlayers, currentTime) {
    const direction = new Vector3()
      .subVectors(targetPos, currentPos)
      .normalize();
    const currentVelocity = direction.multiplyScalar(5); // 이동 속도

    // 현재 위치에서 미래 위치 예측
    const futurePos = new Vector3()
      .copy(currentPos)
      .add(currentVelocity.multiplyScalar(this.config.predictionTime));

    let willCollide = false;
    let nearestCollisionPoint = null;
    let minDistance = Infinity;

    // 다른 플레이어들의 미래 위치도 예측하여 충돌 체크
    for (const player of otherPlayers) {
      const otherFuturePos = this.predictPlayerPosition(player, currentTime);
      const distance = futurePos.distanceTo(otherFuturePos);

      const minSafeDistance =
        this.config.playerRadius * 2 + this.config.safetyMargin;

      if (distance < minSafeDistance && distance < minDistance) {
        willCollide = true;
        nearestCollisionPoint = otherFuturePos;
        minDistance = distance;
      }
    }

    if (willCollide && nearestCollisionPoint) {
      return this.calculateAvoidancePoint(
        currentPos,
        nearestCollisionPoint,
        targetPos,
      );
    }

    return targetPos;
  }

  // 플레이어의 미래 위치 예측
  predictPlayerPosition(player, currentTime) {
    const timeDelta = currentTime - player.lastUpdateTime;
    return new Vector3()
      .copy(player.position)
      .add(player.velocity.multiplyScalar(timeDelta));
  }

  // 충돌 회피 지점 계산
  calculateAvoidancePoint(currentPos, collisionPos, targetPos) {
    // 충돌 지점으로부터의 회피 방향 계산
    const avoidanceDirection = new Vector3()
      .subVectors(currentPos, collisionPos)
      .normalize();

    // 목표 방향
    const targetDirection = new Vector3()
      .subVectors(targetPos, currentPos)
      .normalize();

    // 회피 방향과 목표 방향을 결합
    const combinedDirection = new Vector3()
      .addVectors(avoidanceDirection, targetDirection)
      .normalize();

    // 최종 회피 지점 계산
    return new Vector3()
      .copy(currentPos)
      .add(combinedDirection.multiplyScalar(this.config.maxDeviationDistance));
  }

  // 경로의 각 세그먼트에 대한 충돌 검사
  checkPathSegments(path, otherPlayers, currentTime) {
    const adjustedPath = [];

    for (let i = 0; i < path.length - 1; i++) {
      const currentPoint = path[i];
      const nextPoint = path[i + 1];

      // 세그먼트 중간 지점들에 대한 충돌 검사
      const numSubPoints = 5; // 세그먼트 분할 수
      for (let j = 0; j <= numSubPoints; j++) {
        const t = j / numSubPoints;
        const subPoint = new Vector3().lerpVectors(currentPoint, nextPoint, t);

        const adjustedPoint = this.checkFutureCollision(
          currentPoint,
          subPoint,
          otherPlayers,
          currentTime,
        );

        if (j < numSubPoints) {
          adjustedPath.push(adjustedPoint);
        }
      }
    }

    adjustedPath.push(path[path.length - 1]);
    return adjustedPath;
  }
}
