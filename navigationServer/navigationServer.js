import net from 'net';
import { onConnection } from './events/onConnection.js';
import dotenv from 'dotenv';
import { navigationWorker } from './MQ/onWork.js'; // 지우면 안 됨!!!

dotenv.config();

const PORT = 3800;
const HOST = '0.0.0.0';

const navigationServer = net.createServer(onConnection);

try {
  navigationServer.listen(PORT, HOST, () => {
    console.log(`[네비게이션 서버]가 ${HOST}:${PORT}에서 실행 중입니다.`);
    console.log(navigationServer.address());
  });
} catch (error) {
  console.error(`[네비게이션 서버] 오류 발생:`, error);
  process.exit(1); // 오류 발생 시 서버 종료
}
