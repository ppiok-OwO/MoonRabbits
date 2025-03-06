import { loadNavMesh } from './navMeshLoader.js';

// export const townNavMesh = await loadNavMesh('Town Exported NavMesh.obj');
export const townNavMesh = null;
// export const aSectorNavMesh = await loadNavMesh('Test Exported NavMesh.obj');
export const aSectorNavMesh = null;

// 첫번째 섹터 정식 네브
// export const Sector1NavMesh = await loadNavMesh('Sector1 Exported NavMesh.obj');
export const Sector1NavMesh = null;
// export const Sector2NavMesh = await loadNavMesh('Sector2 Exported NavMesh.obj');
export const Sector2NavMesh = null;
// export const Sector3NavMesh = await loadNavMesh('Sector3 Exported NavMesh.obj');
export const Sector3NavMesh = null;

export const getNavMesh = (sectorCode) => {
  switch (sectorCode) {
    case 100:
      return townNavMesh;
    case 2:
      return aSectorNavMesh;
    case 101:
      return Sector1NavMesh;
    case 102:
      return Sector2NavMesh;
    case 103:
      return Sector3NavMesh;
    default:
      console.error('잘못된 sector Code :', sectorCode);
      return null;
  }
};
