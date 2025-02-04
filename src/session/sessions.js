import SocketManager from '../classes/manager/socket.manager.js';

export const gameSessions = new Map();

export const socketManager = new SocketManager();



// 1. 사용자 한 명 한테만 보내기
// 2. 접속 중인 모든 사용자에게 보내기
// 3. 특정 파티에게만 보내기
// 4. 던전 입장 중인 사용자에게 보내기
// 5. 