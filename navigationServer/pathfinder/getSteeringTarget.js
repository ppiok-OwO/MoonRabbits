export const getSteeringTarget = (
  currentPosition,
  path,
  lookaheadDistance = 2,
) => {
  let closestPoint = path[0];
  let closestDistance = Infinity;
  let steeringTarget = path[path.length - 1]; // 기본적으로 마지막 점

  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    const dx = point.x - currentPosition.x;
    const dy = point.y - currentPosition.y;
    const dz = point.z - currentPosition.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
    }

    if (distance > lookaheadDistance) {
      steeringTarget = point;
      break;
    }
  }

  return steeringTarget;
};
