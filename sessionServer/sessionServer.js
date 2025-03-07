import net from 'net';
import dotenv from 'dotenv';
import { onConnection } from './events/onConnection.js';

dotenv.config();

const server = net.createConnection(onConnection);

server.listen(process.env.PORT, process.env.HOST, () => {
  try {
    console.log(
      `세션 서버가 ${process.env.HOST}:${process.env.PORT}에서 실행 중입니다.`,
    );
    console.log(server.address());
  } catch (error) {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
});
