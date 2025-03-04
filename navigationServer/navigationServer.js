import net from 'net';
import { onConnection } from './events/onConnection.js';
import initServer from './init/init.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3800;
const HOST = '0.0.0.0';

const navigationServer = net.createServer(onConnection);

initServer()
  .then(() => {
    navigationServer.listen(PORT, HOST, () => {
      console.log(`[네비게이션 서버]가 ${HOST}:${PORT}에서 실행중입니다.`);
      console.log(navigationServer.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
