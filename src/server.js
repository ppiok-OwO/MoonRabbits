import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';
import { addServerLog, reportMetric, reportErrorLog, reportServerLog, addErrorLog, reportPacketLog } from './utils/log/log.js';

const server = net.createServer(onConnection);

process.on('unhandledRejection', (reason, promise) => {
  const stack = reason instanceof Error ? reason.stack : '';
  const match = stack.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
      const [_, file, line, column] = match;
      addErrorLog(`Unhandled Rejection: ${reason} (파일: ${file}, 행: ${line}, 열: ${column})`);
  } else {
      addErrorLog(`Unhandled Rejection: ${reason}`);
  }
});

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(
        `[메인서버]가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`,
      );
      console.log(server.address());
      
      addServerLog(`[메인서버]가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      reportMetric();
      reportServerLog();
      reportPacketLog();
      reportErrorLog();
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
