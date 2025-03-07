import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const server = net.createServer(onConnection);
export const serverIP = getPublicIP();

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(
        `[메인서버]가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`,
      );
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

// AWS EC2의 퍼블릭 IP 조회 API
async function getPublicIP() {
  const tokenResponse = await fetch('http://169.254.169.254/latest/api/token', {
    method: 'PUT',
    headers: {
      'X-aws-ec2-metadata-token-ttl-seconds': '21600', // 6시간 유효
    },
  });

  const token = await tokenResponse.text();

  const response = await fetch(
    'http://169.254.169.254/latest/meta-data/public-ipv4',
    {
      headers: {
        'X-aws-ec2-metadata-token': token,
      },
    },
  );

  return response.text();
}
