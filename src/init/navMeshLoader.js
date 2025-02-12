import fs from 'fs';
import path from 'path';
import RecastModule from 'recast-detour';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// Recast 모듈 초기화 (비동기)
let Recast;

async function initRecast() {
  if (!Recast) {
    Recast = await RecastModule();
  }
}

// NavMesh 로드 및 초기화
export async function loadNavMesh(objFile) {
  await initRecast(); // Recast 초기화 대기

  const objData = fs.readFileSync(path.join(basePath, objFile), 'utf-8');
  console

  const navMesh = new Recast.NavMesh();
  const config = new Recast.rcConfig();

  // NavMesh 설정
  config.cs = 0.3;
  config.ch = 0.2;
  config.walkableSlopeAngle = 45;
  config.walkableHeight = 2;
  config.walkableClimb = 0.9;
  config.walkableRadius = 0.6;

  // NavMesh 빌드 (간단화된 예제)
  navMesh.build(objData, objData.length, [], 0, config);

  return navMesh;
}

// 경로 탐색 함수
export async function findPath(navMesh, startPos, endPos) {
  await initRecast(); // Recast 초기화 대기

  // Vec3 객체 생성
  const start = new Recast.Vec3();
  start.x = startPos.x;
  start.y = startPos.y;
  start.z = startPos.z;

  const end = new Recast.Vec3();
  end.x = endPos.x;
  end.y = endPos.y;
  end.z = endPos.z;

  // 부드러운 경로 탐색
  const navPath = navMesh.computePath(start, end);

  // 결과 변환
  const path = [];
  for (let i = 0; i < navPath.getPointCount(); i++) {
    const point = navPath.getPoint(i);
    path.push({ x: point.x, y: point.y, z: point.z });
  }

  return path;
}
