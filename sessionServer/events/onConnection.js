import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  socket.on('data', onData);
  socket.on('end', onEnd);
  socket.on('error', onError);
};
