import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';
import { getPlayerSession, playerSession } from '../session/sessions.js';

export const onConnection = (socket) => {
  console.log(
    '클라이언트가 연결되었습니다:',
    socket.remoteAddress,
    socket.remotePort,
  );

  // 소켓 객체에 buffer 속성을 추가하여 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);

  // 깡통 player 생성
  const player = playerSession.addPlayer(socket);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
