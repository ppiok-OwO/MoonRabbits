import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
