import { loadNavMesh } from './navMeshLoader.js';

export const townNavMesh = await loadNavMesh('Town Exported NavMesh.obj');
export const aSectorNavMesh = await loadNavMesh('Test Exported NavMesh.obj');
