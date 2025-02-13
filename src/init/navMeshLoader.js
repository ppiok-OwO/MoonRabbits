import fs from 'fs';
import path from 'path';
import RecastModule from 'recast-detour';
import { fileURLToPath } from 'url';

// obj 파일의 절대 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// recast-detour 모듈을 쓰기 위한 인스턴스 생성 작업
let Recast;

async function initRecast() {
  if (!Recast) {
    Recast = await RecastModule();
  }
}

// AABB 범위 계산 함수(맵의 경계부를 알기 위해서)
function calculateBounds(vertices) {
  const bmin = { x: Infinity, y: Infinity, z: Infinity };
  const bmax = { x: -Infinity, y: -Infinity, z: -Infinity };

  vertices.forEach(([x, y, z]) => {
    bmin.x = Math.min(bmin.x, x);
    bmin.y = Math.min(bmin.y, y);
    bmin.z = Math.min(bmin.z, z);
    bmax.x = Math.max(bmax.x, x);
    bmax.y = Math.max(bmax.y, y);
    bmax.z = Math.max(bmax.z, z);
  });

  console.log('min', bmin, 'max', bmax);

  return { bmin, bmax };
}

// NavMesh 로드 및 초기화
export async function loadNavMesh(objFile) {
  await initRecast();

  // obj 파일 파싱
  const objData = fs.readFileSync(path.join(basePath, objFile), 'utf-8');

  const navMesh = new Recast.NavMesh();
  const config = new Recast.rcConfig();

  const vertices = [];
  const indices = [];

  // vertices와 indices 데이터를 추출
  objData.split('\n').forEach((line) => {
    const parts = line.trim().split(' ');
    if (parts[0] === 'v') {
      vertices.push(parts.slice(1).map(Number));
    } else if (parts[0] === 'f') {
      indices.push(...parts.slice(1).map((idx) => parseInt(idx, 10) - 1));
    }
  });

  if (vertices.length === 0) throw new Error('정점 데이터가 없습니다.');
  if (indices.length === 0 || indices.length % 3 !== 0)
    throw new Error('인덱스 데이터가 잘못되었습니다.');

  // Recast 인스턴스의 설정값을 조정
  const { bmin, bmax } = calculateBounds(vertices);
  config.bmin = bmin;
  config.bmax = bmax;

  config.cs = 0.1;
  config.ch = 0.1;
  config.walkableSlopeAngle = 45;
  config.walkableHeight = 2;
  config.walkableClimb = 0.9;
  config.walkableRadius = 0.6;
  config.maxEdgeLen = 3;
  config.maxSimplificationError = 0.01;
  config.minRegionArea = 1;
  config.mergeRegionArea = 2;
  config.tileSize = 8;
  config.borderSize = 4;

  if (config.cs <= 0 || config.ch <= 0)
    throw new Error('cs 또는 ch 값이 0보다 커야 합니다.');
  if (config.tileSize <= 0 || config.borderSize <= 0)
    throw new Error('tileSize 또는 borderSize 값이 유효하지 않습니다.');

  console.log('Vertices:', vertices.length);
  console.log('Indices:', indices.length);
  console.log('bmin:', bmin, 'bmax:', bmax);

  // obj파일에서 추출한 데이터와 설정값을 기반으로 navMesh build
  navMesh.build(
    vertices.flat(),
    vertices.length,
    indices,
    indices.length,
    config,
  );

  return navMesh;
}

export async function findPath(navMesh, startPos, endPos, stepSize = 1) {
  // 이유는 모르겠는데 찾아보니까 Recast 인스턴스는 비동기로 초기화를 해줘야 한다.
  await initRecast();

  // 시작점과 끝점을 설정해주기
  const start = new Recast.Vec3(startPos.x, startPos.y, startPos.z);
  const end = new Recast.Vec3(endPos.x, endPos.y, endPos.z);

  // 탐색범위 설정(주변에서 가장 가까운 폴리곤을 찾을 때 어느 정도 거리까지 탐색할지)
  navMesh.setDefaultQueryExtent(new Recast.Vec3(50, 50, 50));

  const closestStart = navMesh.getClosestPoint(start);
  const closestEnd = navMesh.getClosestPoint(end);

  // recast-detour 모듈에 내장된 computePath() 메서드를 이용해서 경로 생성하기
  const navPath = navMesh.computePath(closestStart, closestEnd);
  let rawPath = [];

  // navPath에 저장된 좌표를 디버그 터미널로 찍어보면 직접 접근 불가능.
  // 그래서 getPoint()메서드를 통해 추출하는 작업이 필요
  for (let i = 0; i < navPath.getPointCount(); i++) {
    const point = navPath.getPoint(i);
    rawPath.push({ x: point.x, y: point.y, z: point.z });
  }

  // computePath의 시작점과 끝점을 `startPos`와 `endPos`로 강제 설정
  if (rawPath.length > 0) {
    rawPath[0] = { x: startPos.x, y: startPos.y, z: startPos.z };
    rawPath[rawPath.length] = { x: endPos.x, y: endPos.y, z: endPos.z };
  } else {
    rawPath.push({ x: startPos.x, y: startPos.y, z: startPos.z });
    rawPath.push({ x: endPos.x, y: endPos.y, z: endPos.z });
  }

  return interpolatePath(rawPath, stepSize);
}

// 찾아보니까 유니티 navMesh에서 쓰는 보간법은 steering target이라고 한다.(아마도?)
// 현재 위치에서 다음 방향을 미리 설정하고 부드럽게 회전 => 경로 점을 직선으로 따라가는 것이 아니라, 미리 방향을 예측하고 보간함
// 다음 방향을 미리 설정할 때 일정 거리 내 가장 먼 지점을 고르는데 그 범위를 lookaheadDistance로 설정하는 셈
function getSteeringTarget(currentPosition, path, lookaheadDistance = 2) {
  let closestPoint = path[0];
  let closestDistance = Infinity;
  let steeringTarget = path[path.length - 1]; // 기본적으로 마지막 점

  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    const dx = point.x - currentPosition.x;
    const dz = point.z - currentPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

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
