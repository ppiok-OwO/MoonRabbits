import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(
        `[메인서버]가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`,
      );
      console.log(server.address());

      const logstash = new net.Socket();
      logstash.connect(5000, "59.8.54.12", () => {
        console.log("Connected to Logstash");
      });

      setInterval(() => {
        const log = {
          timestamp : new Date().toISOString(),
          level: "info",
          message: "User logged in",
          user: "test"
        };

        console.log(log);
        logstash.write(JSON.stringify(log) + "\n");
      }, 5000);

      logstash.on("end", () => {
        console.error("Logstash Closed:");
      });

      logstash.on("error", err => {
        console.error("Logstash Error:", err);
      });
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
