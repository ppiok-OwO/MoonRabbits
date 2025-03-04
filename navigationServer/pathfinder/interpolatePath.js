import { getSteeringTarget } from './getSteeringTarget.js';

export const interpolatePath = (rawPath, stepSize) => {
  if (rawPath.length < 2) return rawPath;

  const interpolatedPath = [];
  interpolatedPath.push(rawPath[0]); // 첫 번째 점(시작점) 추가

  for (let i = 0; i < rawPath.length - 1; i++) {
    const p1 = rawPath[i];
    const p2 = rawPath[i + 1];

    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const steps = Math.max(1, Math.round(distance / stepSize));

    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      const steeringTarget = getSteeringTarget(p1, rawPath, stepSize * 2);

      interpolatedPath.push({
        x: p1.x + (steeringTarget.x - p1.x) * t,
        y: p1.y + (steeringTarget.y - p1.y) * t,
        z: p1.z + (steeringTarget.z - p1.z) * t,
      });
    }
  }

  interpolatedPath.push(rawPath[rawPath.length - 1]); // 마지막 점 추가
  return interpolatedPath;
};
