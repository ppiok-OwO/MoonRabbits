export function isPlayerWithInMonsterView(
  monsterPos,
  monsterAngle,
  viewAngle,
  viewDistance,
  playerPos,
) {
  // 플레이어와 몬스터 사이의 거리 계산
  const dx = playerPos.x - monsterPos.x;
  const dy = playerPos.y - monsterPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 거리가 시야 거리보다 멀면 거짓
  if (distance > viewDistance) {
    return false;
  }

  let angle = Math.atan2(dy, dx);

  if (angle < 0) angle += 2 * Math.PI;

  let normalizedMonsterAngle = monsterAngle;
  while (normalizedMonsterAngle < 0) {
    normalizedMonsterAngle += 2 * Math.PI;
  }

  while (normalizedMonsterAngle >= 2 * Math.PI) {
    normalizedMonsterAngle -= 2 * Math.PI;
  }

  // 시야각의 절반
  const halfViewAngle = viewAngle / 2;

  //각도 차이
  let angleDiff = Math.abs(angle - normalizedMonsterAngle);

  //각도 차이 보정
  if (angleDiff > Math.PI) {
    angleDiff = 2 * Math.PI - angleDiff;
  }

  return angleDiff <= halfViewAngle;
}
