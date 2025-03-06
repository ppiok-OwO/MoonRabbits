import Vec3 from '../../classes/Vec3.class.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

/* 해당 코드는 현재 마음에 들지 않음 나중에 리팩토링 씨게 가야함 */

function safeValue(value, defaultValue) {
  return value !== undefined && value !== null ? value : defaultValue;
}

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

export function checkCapsuleCollision(data) {
  // 디버깅을 위한 로그
  //console.log('Received raw data:', JSON.stringify(data, null, 2));

  // 중첩 구조 처리 (C2SCollision -> CollisionInfo)
  const collisionInfo = data.CollisionInfo || data.collisionInfo || data;

  // 디버깅을 위한 로그
  // console.log(
  //   'Extracted collision info:',
  //   JSON.stringify(collisionInfo, null, 2),
  // );

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
  // console.log('Processing with normalized data:', {
  //   sectorCode,
  //   myType,
  //   myId,
  //   myPosition: { x: myPosition.x, y: myPosition.y, z: myPosition.z },
  //   myRadius,
  //   myHeight,
  //   targetType,
  //   targetId,
  //   targetPosition: {
  //     x: targetPosition.x,
  //     y: targetPosition.y,
  //     z: targetPosition.z,
  //   },
  //   targetRadius,
  //   targetHeight,
  // });

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
    // 0. 서버의 플레이어와 몬스터가 클라이언트가 보낸 위치에 있는가?!
    const currentSector = getSectorSessions().getSectorByCode(sectorCode);
    if (!currentSector) {
      console.error(`섹터 ${sectorCode}를 찾을 수 없습니다`);
      return pushInfo;
    }

    // 서버에 저장된 플레이어 또는 몬스터 객체 가져오기
    const serverMyObj = getSwitching(currentSector, myType, myId);
    const serverTargetObj = getSwitching(currentSector, targetType, targetId);

    // 서버 객체가 존재하는지 확인
    if (!serverMyObj || !serverTargetObj) {
      console.error(`충돌 검사 대상 객체를 찾을 수 없습니다: 
        내 객체(${myType}, ${myId}): ${serverMyObj ? '있음' : '없음'}, 
        대상 객체(${targetType}, ${targetId}): ${serverTargetObj ? '있음' : '없음'}`);
      return pushInfo;
    }

    // 서버의 위치와 클라이언트가 보낸 위치 비교 로직
    const isPositionValid = validatePositions(
      serverMyObj,
      serverTargetObj,
      myPosition,
      targetPosition,
      myType,
      targetType,
    );

    if (!isPositionValid) {
      console.warn(`위치 검증 실패: 
        서버와 클라이언트 위치가 너무 다릅니다.
        myType: ${myType}, myId: ${myId}
        targetType: ${targetType}, targetId: ${targetId}`);
      return pushInfo; // 충돌 없음으로 응답
    }

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
    // const minDistanceSquared = minDistance * minDistance;

    // 4. 충돌 검사
    if (Math.sqrt(distanceSquared) <= minDistance) {
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

      if (
        (myType === 1 && targetType === 2) ||
        (myType === 2 && targetType === 1)
      ) {
        const playerId = myType === 1 ? myId : targetId;
        const monsterId = myType === 1 ? targetId : myId;

        // 몬스터 객체 가져오기
        const monster = getSwitching(currentSector, 2, monsterId);

        if (monster && typeof monster.handleCollisionPacket === 'function') {
          // 몬스터의 handleCollisionPacket 함수 호출
          monster.handleCollisionPacket({
            playerId: playerId,
          });
        }
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

function validatePositions(
  serverMyObj,
  serverTargetObj,
  clientMyPos,
  clientTargetPos,
  myType,
  targetType,
) {
  // 서버 객체가 없으면 검증 실패
  if (!serverMyObj || !serverTargetObj) {
    return false;
  }

  // 플레이어와 몬스터에 따라 다른 위치 속성 이름 사용
  const getPosition = (obj, type) => {
    // 플레이어는 position 객체를 사용
    if (type === 1) {
      if (!obj.position) return null;
      return new Vec3(
        obj.position.posX || 0,
        obj.position.posY || 0,
        obj.position.posZ || 0,
      );
    }
    // 몬스터는 다른 위치 속성을 사용할 수 있음
    else if (type === 2) {
      // 몬스터 클래스의 위치 속성에 따라 이 부분 수정 필요
      if (!obj.position && !obj.transform) return null;

      // position 또는 transform 속성 확인
      const pos = obj.position || obj.transform;
      return new Vec3(
        pos.posX || pos.x || 0,
        pos.posY || pos.y || 0,
        pos.posZ || pos.z || 0,
      );
    }

    return null;
  };

  const serverMyPos = getPosition(serverMyObj, myType);
  const serverTargetPos = getPosition(serverTargetObj, targetType);

  // 서버 위치를 가져올 수 없으면 검증 실패
  if (!serverMyPos || !serverTargetPos) {
    console.error('서버 객체에서 위치 정보를 가져올 수 없습니다');
    return false;
  }

  // 클라이언트와 서버 위치의 차이 계산
  const myPosDiffX = Math.abs(clientMyPos.x - serverMyPos.x);
  const myPosDiffY = Math.abs(clientMyPos.y - serverMyPos.y);
  const myPosDiffZ = Math.abs(clientMyPos.z - serverMyPos.z);

  const targetPosDiffX = Math.abs(clientTargetPos.x - serverTargetPos.x);
  const targetPosDiffY = Math.abs(clientTargetPos.y - serverTargetPos.y);
  const targetPosDiffZ = Math.abs(clientTargetPos.z - serverTargetPos.z);

  // 허용 가능한 오차 범위 (서버 환경에 맞게 조정 필요)
  const toleranceX = 5.0; // X축 허용 오차
  const toleranceY = 2.0; // Y축 허용 오차
  const toleranceZ = 5.0; // Z축 허용 오차

  // 몬스터의 경우 더 큰 허용 오차 적용 (이동이 더 빠를 수 있음)
  const myTolerance = myType === 2 ? 1.5 : 1.0; // 몬스터는 1.5배 허용 오차
  const targetTolerance = targetType === 2 ? 1.5 : 1.0; // 몬스터는 1.5배 허용 오차

  // 위치 차이가 허용 오차 이내인지 확인
  const isMyPosValid =
    myPosDiffX <= toleranceX * myTolerance &&
    myPosDiffY <= toleranceY * myTolerance &&
    myPosDiffZ <= toleranceZ * myTolerance;

  const isTargetPosValid =
    targetPosDiffX <= toleranceX * targetTolerance &&
    targetPosDiffY <= toleranceY * targetTolerance &&
    targetPosDiffZ <= toleranceZ * targetTolerance;

  // 디버깅용 로그 (서버 부하를 감안하여 필요시에만 사용)
  if (!isMyPosValid || !isTargetPosValid) {
    console.debug(`위치 불일치 감지:
      내 객체 차이 - X: ${myPosDiffX.toFixed(2)}, Y: ${myPosDiffY.toFixed(2)}, Z: ${myPosDiffZ.toFixed(2)}
      타겟 객체 차이 - X: ${targetPosDiffX.toFixed(2)}, Y: ${targetPosDiffY.toFixed(2)}, Z: ${targetPosDiffZ.toFixed(2)}
      허용 오차 - X: ${toleranceX}, Y: ${toleranceY}, Z: ${toleranceZ}`);
  }

  // 두 위치 모두 유효해야 true 반환
  return isMyPosValid && isTargetPosValid;
}

function getSwitching(sector, type, id) {
  if (!sector) return null;

  switch (type) {
    case 1: // 플레이어
      return getPlayer(id);
    case 2: // 몬스터
      return getMonster(sector, id);
    default:
      console.warn(`알 수 없는 객체 타입: ${type}`);
      return null;
  }
}

function getMonster(sector, id) {
  if (!sector) return null;

  // sector.class.js 파일에 정의된 getMonster 메소드 사용
  const serverMonster = sector.getMonster(id);
  if (!serverMonster) {
    console.warn(`몬스터 ID ${id}를 찾을 수 없습니다`);
  }
  return serverMonster;
}

function getPlayer(id) {
  const serverPlayer = getPlayerSession().getPlayerById(id);
  if (!serverPlayer) {
    console.warn(`플레이어 ID ${id}를 찾을 수 없습니다`);
  }
  return serverPlayer;
}

export function collisionHandler(socket, data) {
  try {
    // 충돌 검사 수행
    const packet = checkCapsuleCollision(data);

    // 충돌 정보에서 섹터 코드 추출 (중첩 구조 고려)
    const collisionInfo = data.CollisionInfo || data.collisionInfo || data;
    const sectorCode = safeValue(
      collisionInfo.SectorCode || collisionInfo.sectorCode,
      0,
    );

    // getSectorSessions 함수가 있고 sectorCode가 있을 때만 실행
    if (typeof getSectorSessions === 'function' && sectorCode !== undefined) {
      const sector = getSectorSessions().getSectorByCode(sectorCode);
      if (sector) {
        const sendPacket = PACKET.S2CCollision(packet);
        sector.notify(sendPacket);
      } else {
        console.warn(`Sector with code ${sectorCode} not found`);
      }
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
