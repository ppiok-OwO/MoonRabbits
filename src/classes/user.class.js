import { getPlayerSession, getUserSessions } from '../session/sessions.js';
import { makePingPacket } from '../utils/packet/makePingPacket.js';

class User {
  constructor(socket) {
    this.nickname = null;
    this.socket = socket;
    this.latency = 0;
    this.lastPong = Date.now();
  }

  getSocket() {
    return this.socket;
  }

  getLatency() {
    return this.latency;
  }

  // 레이턴시
  ping() {
    const now = Date.now();
    this.socket.write(makePingPacket(now));
  }

  handlePong(milliseconds) {
    const now = Date.now();
    this.lastPong = now;
    this.latency = (now - milliseconds) / 2; // 왕복이니까
  }

  checkPong = async () => {
    const now = Date.now();
    console.log('연결 췤!: ', now - this.lastPong);

    // // 10초 이상 퐁이 오지 않으면 연결 종료(디버깅할 땐 주석처리하기!!)
    // if (now - this.lastPong > 10000) {
    //   console.log('클라이언트가 연결을 종료했습니다.');

    //   // 세션들
    //   const userSession = getUserSessions();

    //   // 게임 세션에서 유저 삭제
    //   userSession.removeUser(this.socket);
    //   // 세션의 유저 배열이 빈 배열이면 세션과 인터벌도 삭제

    //   this.socket.destroy(); // 서버에서 소켓 종료
    // }
  };
}

export default User;
