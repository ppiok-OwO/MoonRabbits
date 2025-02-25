import Vec3 from '../../classes/Vec3.class.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';

/**
 * 기본값을 사용한 안전한 값 추출 함수
 * @param {any} value - 확인할 값
 * @param {any} defaultValue - 기본값
 * @returns {any} 유효한 값 또는 기본값
 */
function safeValue(value, defaultValue) {
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * 위치 객체를 안전하게 처리하는 함수
 * @param {Object} position - 위치 객체
 * @returns {Object} 유효한 Vec3 객체
 */
function safePosition(position) {
  if (!position || typeof position !== 'object') {
    return new Vec3(0, 0, 0);
  }

  // 클라이언트에서는 X, Y, Z (대문자)로 보내지만
  // 서버에서는 x, y, z (소문자)로 사용함
  return new Vec3(
    safeValue(position.X || position.x, 0),
    safeValue(position.Y || position.y, 0),
    safeValue(position.Z || position.z, 0),
  );
}

/**
 * 두 캡슐 간의 충돌 검사 함수
 * @param {Object} data - 클라이언트에서 받은 충돌 정보
 * @returns {Object} 충돌 결과 및 밀어내기 정보
 */
export function checkCapsuleCollision(data) {
  // 디버깅을 위한 로그
  console.log('Received raw data:', JSON.stringify(data, null, 2));

  // 중첩 구조 처리 (C2SCollision -> CollisionInfo)
  const collisionInfo = data.CollisionInfo || data;

  // 디버깅을 위한 로그
  console.log(
    'Extracted collision info:',
    JSON.stringify(collisionInfo, null, 2),
  );

  // Protocol Buffer에서는 필드명이 대문자로 시작할 수 있음
  // 안전하게 값을 추출 (대소문자 모두 검사)
  const sectorCode = safeValue(
    collisionInfo.SectorCode || collisionInfo.sectorCode,
    0,
  );
  const myType = safeValue(collisionInfo.MyType || collisionInfo.myType, 0);
  const myId = safeValue(collisionInfo.MyId || collisionInfo.myId, 0);
  const myRadius = safeValue(
    collisionInfo.MyRadius || collisionInfo.myRadius,
    0,
  );
  const myHeight = safeValue(
    collisionInfo.MyHeight || collisionInfo.myHeight,
    0,
  );
  const targetType = safeValue(
    collisionInfo.TargetType || collisionInfo.targetType,
    0,
  );
  const targetId = safeValue(
    collisionInfo.TargetId || collisionInfo.targetId,
    0,
  );
  const targetRadius = safeValue(
    collisionInfo.TargetRadius || collisionInfo.targetRadius,
    0,
  );
  const targetHeight = safeValue(
    collisionInfo.TargetHeight || collisionInfo.targetHeight,
    0,
  );

  // Vec3 객체로 변환하여 안전하게 처리
  const myPosition = safePosition(
    collisionInfo.MyPosition || collisionInfo.myPosition,
  );
  const targetPosition = safePosition(
    collisionInfo.TargetPosition || collisionInfo.targetPosition,
  );

  // 디버깅을 위한 로그
  console.log('Processing with normalized data:', {
    sectorCode,
    myType,
    myId,
    myPosition: { x: myPosition.x, y: myPosition.y, z: myPosition.z },
    myRadius,
    myHeight,
    targetType,
    targetId,
    targetPosition: {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    },
    targetRadius,
    targetHeight,
  });

  // 기본 응답 객체 생성 (충돌 없음으로 초기화)
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

  try {
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
        sectorCode,
        myType,
        myId,
        targetType,
        targetId,
        pushDirection,
        pushDistance,
      );
    }
  } catch (error) {
    console.error('Error during collision check:', error);
    // 에러 발생 시 기본 응답 (충돌 없음) 반환
  }

  return pushInfo;
}

/**
 * 충돌 데이터 처리 핸들러
 * @param {Object} socket - 소켓 객체
 * @param {Object} data - 충돌 정보
 */
export function collisionHandler(socket, data) {
  try {
    // 충돌 검사 수행
    const packet = checkCapsuleCollision(data);

    // 충돌 정보에서 섹터 코드 추출 (중첩 구조 고려)
    const collisionInfo = data.CollisionInfo || data;
    const sectorCode = collisionInfo.SectorCode || collisionInfo.sectorCode;

    // getSectorSessions 함수가 있고 sectorCode가 있을 때만 실행
    if (typeof getSectorSessions === 'function' && sectorCode !== undefined) {
      getSectorSessions().getSector(sectorCode).notify(packet);
    } else {
      console.warn(
        'Unable to notify sector - missing getSectorSessions or sectorCode',
        {
          sectorCode,
          hasFunction: typeof getSectorSessions === 'function',
        },
      );
    }
  } catch (error) {
    console.error('Error in collision handler:', error);
    // 에러 처리
  }
}
