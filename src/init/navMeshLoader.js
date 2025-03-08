import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NavMeshQuery } from 'recast-navigation';
import { generateSoloNavMesh } from 'recast-navigation/generators';
import { init } from 'recast-navigation';

await init();

// obj 파일의 절대 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// NavMesh 로드 및 초기화
export async function loadNavMesh(objFile) {
  try {
    const objData = fs.readFileSync(path.join(basePath, objFile), 'utf-8');

    const vertices = [];
    const indices = [];

    objData.split('\n').forEach((line) => {
      const parts = line.trim().split(' ');
      if (parts[0] === 'v') {
        vertices.push(parts.slice(1).map(Number));
      } else if (parts[0] === 'f') {
        indices.push(...parts.slice(1).map((idx) => parseInt(idx, 10) - 1));
      }
    });

    if (vertices.length === 0) console.log('정점 데이터가 없습니다.');
    if (indices.length === 0 || indices.length % 3 !== 0)
      console.log('인덱스 데이터가 잘못되었습니다.');

    const navMeshConfig = {
      cs: 0.1,
      ch: 0.1,
      walkableSlopeAngle: 21.1, // NavMeshAgent의 Max Slope랑 같게
      walkableHeight: 2, // NavMeshAgent의 height랑 같게
      walkableClimb: 0.11, // NavMeshAgent의 Step Height랑 같게
      walkableRadius: 0.64, // NavMeshAgent의 radius랑 같게
      maxEdgeLen: 3,
      maxSimplificationError: 0.01,
      minRegionArea: 1,
      mergeRegionArea: 2,
      tileSize: 8,
      borderSize: 4,
    };

    console.log('Vertices:', vertices.length);
    console.log('Indices:', indices.length);

    const { success, navMesh } = generateSoloNavMesh(
      vertices.flat(),
      indices,
      navMeshConfig,
    );

    if (!success) throw new Error('NavMesh 생성 실패');

    return navMesh;
  } catch (error) {
    console.error(error);
  }
}

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

// 찾아보니까 유니티 navMesh에서 쓰는 보간법은 steering target이라고 한다.(아마도?)
// 현재 위치에서 다음 방향을 미리 설정하고 부드럽게 회전 => 경로상의 점을 직선으로 따라가는 것이 아니라, 미리 방향을 예측하고 보간함
// 다음 방향을 미리 설정할 때 일정 거리 내 가장 먼 지점을 고르는데 그 범위를 lookaheadDistance로 설정하는 셈
function getSteeringTarget(currentPosition, path, lookaheadDistance = 2) {
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
}

// steering target방식으로 path 보간하기
function interpolatePath(rawPath, stepSize) {
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
}
