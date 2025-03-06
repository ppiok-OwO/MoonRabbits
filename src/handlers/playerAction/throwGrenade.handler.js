import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const GRAVITY = 9.81;
const THROW_POWER = 4;
const COOL_TIME = 5;

const throwGrenadeHandler = (socket, packetData) => {
  const { startPos, targetPos } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  const packet = PACKET.S2CThrowGrenade(
    player.id,
    getThrowVelocity(startPos, targetPos),
    COOL_TIME,
  );

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.notify(packet);
};

export default throwGrenadeHandler;

function getThrowVelocity(startPos, targetPos) {
  // 목표 위치 및 수평 거리 계산
  const flatTarget = { x: targetPos.x, y: startPos.y, z: targetPos.z };
  const distance = Math.sqrt(
    Math.pow(startPos.x - flatTarget.x, 2) +
      Math.pow(startPos.z - flatTarget.z, 2),
  );
  const heightDifference = (targetPos.y || 0) - startPos.y;

  // 수직 방향 속도 계산
  const initialVelocityY = Math.sqrt(2 * GRAVITY * THROW_POWER); // throwPower는 목표 높이
  const upTime = initialVelocityY / GRAVITY; // 상승 시간
  const downTime = Math.sqrt((2 * Math.max(0, heightDifference)) / GRAVITY); // 하강 시간
  const timeToTarget = upTime + downTime; // 총 비행 시간

  // 수평 방향 속도 계산
  const initialVelocityXZ = distance / timeToTarget;
  const direction = normalize({
    x: flatTarget.x - startPos.x,
    y: 0,
    z: flatTarget.z - startPos.z,
  });
  const velocity = {
    x: direction.x * initialVelocityXZ,
    y: initialVelocityY,
    z: direction.z * initialVelocityXZ,
  };
  return velocity;
}

function normalize(vector) {
  const length = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
  return length > 0
    ? { x: vector.x / length, y: vector.y / length, z: vector.z / length }
    : { x: 0, y: 0, z: 0 };
}
