import { getGameAssets } from '../../init/assets';
import { getPlayerSession, getSectorSessions } from '../../session/sessions';
import PAYLOAD_DATA from '../../utils/packet/payloadData';

const collisionData = getGameAssets().collision.data((collisionType) => {
  return collisionType.collisionType === collisionType;
});

export function checkCapsuleCollision(collisionInfo) {
  const {
    sectorCode,
    myType,
    myId,
    myPosition,
    myRadius,
    myHeight,
    targetType,
    targetId,
    targetPosition,
    targetRadius,
    targetHeight,
  } = collisionInfo;

  const pushInfo = PAYLOAD_DATA.CollisionPushInfo(
    false, // hasCollision
    sectorCode,
    myType,
    myId,
    targetType,
    targetId,
    new Vec3(), // pushDirection
    0, // pushDistance
  );

  // 1. 높이(y축) 방향으로 겹치는지 확인
  const myTop = myPosition.y + myHeight / 2;
  const myBottom = myPosition.y - myHeight / 2;
  const targetTop = targetPosition.y + targetHeight / 2;
  const targetBottom = targetPosition.y - targetHeight / 2;

  // 높이 방향으로 겹치지 않으면 충돌 없음
  if (myBottom > targetTop || myTop < targetBottom) {
    return pushInfo;
  }

  // 2. 수평면(x-z 평면)에서의 거리 계산
  const dx = targetPosition.x - myPosition.x;
  const dz = targetPosition.z - myPosition.z;
  const distanceSquared = dx * dx + dz * dz;

  // 3. 충돌이 없기 위한 최소 거리 계산
  const minDistance = myRadius + targetRadius;
  const minDistanceSquared = minDistance * minDistance;

  // 4. 충돌 검사
  if (distanceSquared < minDistanceSquared) {
    // 5. 밀어내기 방향 계산 (타겟에서 자신을 향하는 정규화된 벡터)
    const distance = Math.sqrt(distanceSquared);
    let pushDirection;

    if (distance > 0) {
      pushDirection = new Vec3(
        -dx / distance,
        0, // y축 방향으로는 밀어내지 않음
        -dz / distance,
      );
    } else {
      // 두 객체가 정확히 같은 위치에 있는 경우 기본 방향으로 밀어냄
      pushDirection = new Vec3(1, 0, 0);
    }

    // 6. 밀어내기 거리 계산 (충돌 해결을 위해 얼마나 이동해야 하는지)
    const pushDistance = minDistance - distance;

    // 충돌 발생 - 새 객체 생성하여 반환
    return PAYLOAD_DATA.CollisionPushInfo(
      true, // hasCollision
      myType,
      myId,
      targetType,
      targetId,
      pushDirection,
      pushDistance,
    );
  }

  return pushInfo;
}

export function handleCollisionRequest(collisionInfo) {
  const packet = checkCapsuleCollision(collisionInfo);

  const collisionType = collisionInfo.myType;
  switch (collisionType) {
    case 1:
      getPlayerSession().getPlayer(collisionInfo.myId).sendPacket(packet);
      break;

    case 2:
      getSectorSessions().
  
    default:
      break;
  }
}
