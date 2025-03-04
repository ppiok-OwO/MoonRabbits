import { navigationWorker } from '../MQ/onWork.js';
import { loadNavMesh } from './navMeshLoader/navMeshLoader.js';

const initServer = async () => {
  try {
    // 네브 메쉬 로딩
    
  } catch (error) {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
