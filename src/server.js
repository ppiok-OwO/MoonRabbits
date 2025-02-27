import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const PORTS = [3000, 3001, 3002];

initServer()
  .then(() => {
    PORTS.forEach((port) => {
      const server = net.createServer(onConnection);
      server.listen(port, config.server.host, () => {
        console.log(
          `[메인서버]가 ${config.server.host}:${port}에서 실행 중입니다.`,
        );
      });

      server.on('error', (error) => {
        console.error(`❌ 포트 ${port}에서 서버 실행 중 오류 발생:`, error);
      });
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
