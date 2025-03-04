import { NavMeshQuery } from 'recast-navigation';
import { interpolatePath } from './interpolatePath.js';

export async function findPath(navMesh, startPos, endPos, stepSize = 1) {
  try {
    const navMeshQuery = new NavMeshQuery(navMesh);

    // 시작점과 끝점을 설정해주기
    const start = { x: startPos.x, y: startPos.y, z: startPos.z };
    const end = { x: endPos.x, y: endPos.y, z: endPos.z };

    // 좌표에서 가장 가까운 폴리곤 ID 가져오기
    const { success: startSuccess, polyRef: startRef } =
      navMeshQuery.findClosestPoint(start);
    const { success: endSuccess, polyRef: endRef } =
      navMeshQuery.findClosestPoint(end);
    if (!startSuccess || !endSuccess) {
      // console.log('탐색 가능한 네비게이션 폴리곤을 찾을 수 없습니다.');
    }

    // 폴리곤 기반 경로 탐색
    const { success, polys } = navMeshQuery.findPath(
      startRef,
      endRef,
      start,
      end,
      {
        maxPathPolys: 256,
      },
    );
    if (!success) {
      // console.log('경로를 찾을 수 없습니다.');
    }

    // 경로를 실제 좌표로 변환
    let rawPath = [];
    try {
      for (let i = 0; i < polys.length; i++) {
        const point = navMeshQuery.getClosestPoint({
          x: polys[i].x,
          y: polys[i].y,
          z: polys[i].z,
        });
        rawPath.push({ x: point.x, y: point.y, z: point.z });
      }
    } finally {
      // 메모리 누수를 막기 위해 `destroy()` 호출 (예외 발생 시에도 실행되도록 `finally` 사용)
      polys.destroy();
    }

    // computePath의 시작점과 끝점을 `startPos`와 `endPos`로 강제 설정
    if (rawPath.length > 0) {
      rawPath[0] = start;
      rawPath[rawPath.length] = end;
    } else {
      rawPath.push(start);
      rawPath.push(end);
    }

    return interpolatePath(rawPath, stepSize);
  } catch (error) {
    console.error(error);
  }
}
