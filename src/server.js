import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';
import { collectMetric } from './utils/log/logToFile.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(
        `[메인서버]가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`,
      );
      console.log(server.address());

      collectMetric();
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
