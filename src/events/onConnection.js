import { v4 as uuidv4 } from 'uuid';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';
import { getUserSessions } from '../session/sessions.js';
import { getBlacklist } from './blacklist.js';
import PACKET from '../utils/packet/packet.js';

export const onConnection = async (socket) => {
  const clientIP = socket.remoteAddress; // 헬스 체크 및 클라이언트 IP 확인
  if (!clientIP || clientIP === undefined) {
    socket.destroy();
    return;
  }

  console.log('클라이언트가 연결되었습니다:', clientIP, socket.remotePort);

  // socket.isUnity = false;
  // socket.write(PACKET.S2CChat(0, 'Hello', 'Auth'));
  // setTimeout(()=>{
  //   if(socket.isUnity === true){
  //     console.log('클라이언트 인증 완료');
  //   }else {
  //     console.log('클라이언트 인증 실패');
  //     socket.destroy();
  //   }
  // }, 1000);

  if (clientIP.startsWith('172.31.')) {
    console.log('헬스 체크 요청 감지, 세션 종료');
    socket.destroy(); // 헬스 체크 요청이면 즉시 종료
    return;
  }

  const blacklist = await getBlacklist();

  if (blacklist.has(clientIP)) {
    console.log('잡았다, 요놈!', clientIP);
    socket.destroy(); // 블랙리스트에 올라간 어뷰저의 IP면 즉시 종료
    return;
  }

  // 소켓 객체에 buffer 속성을 추가하여 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);
  socket.id = uuidv4();

  // 유저 생성
  const userSession = getUserSessions();
  const newUser = userSession.setUser(socket);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
