// 서버 초기화 작업
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import { getSectorSessions } from '../session/sessions.js';
import { config } from '../config/config.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    const sectionSessions = getSectorSessions();
    sectionSessions.setSector(config.section.town, 1);// 마을
    sectionSessions.setSector(config.section.testfield);// 채집공간
    // await testAllConnections(pools);
    // 다음 작업
  } catch (err) {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;