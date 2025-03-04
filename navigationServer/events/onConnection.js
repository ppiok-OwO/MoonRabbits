import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(
    'navigation 서버에 연결되었습니다. : ',
    socket.remoteAddress,
    socket.remotePort,
  );

  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
