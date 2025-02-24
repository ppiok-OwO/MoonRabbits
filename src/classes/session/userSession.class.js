import { v4 as uuidV4 } from 'uuid';
import User from '../user.class.js';
import redisClient from '../../utils/redis/redis.config.js';

class UserSession {
  users = new Map();

  setUser(socket) {
    const newUser = new User(socket);

    this.users.set(socket, newUser);

    // 임시 세션 키 생성 (로그인 전으로 userId가 없는 상태)
    const tempKey = `userSession:temp:${socket.id}`;
    redisClient.hset(tempKey, {
      socketId: socket.id,
      status: 'connected',
    });
    // 임시 세션은 일정 시간 후 만료
    redisClient.expire(tempKey, 3600);

    return newUser;
  }

  // 로그인 후 호출되어 userSession 객체와 Redis 세션을 업데이트함
  async updateUserSessionAfterLogin(socket, loginData) {
    // loginData: { userId, nickname, ... }
    const user = this.getUser(socket);
    if (!user) return;

    // in-memory에 사용자 정보 업데이트
    user.userId = loginData.userId;
    user.nickname = loginData.nickname;
    user.loginTime = new Date().toISOString();
    user.status = 'online';

    // 기존 임시 Redis 세션 삭제 (socket 기반)
    const tempKey = `userSession:temp:${socket.id}`;
    await redisClient.del(tempKey);

    // userId 기반 Redis 세션 생성 (Hash 자료구조)
    const key = `userSession:${user.userId}`;
    await redisClient.hset(key, {
      userId: user.userId,
      nickname: user.nickname,
      loginTime: user.loginTime,
      currentSector: user.currentSector || 'None', // 예: "Town" 등
      status: user.status,
    });
    // 세션 만료시간 설정
    await redisClient.expire(key, 3600);

    return user;
  }

  removeUser(socket) {
    const user = this.users.get(socket);
    if (user) {
      const key = `userSession:${user.userId}`;
      redisClient.del(key); // Redis에서 세션 삭제
      this.users.delete(socket);
    }
  }

  getUser(socket) {
    return this.users.get(socket);
  }

  getAllUsers() {
    return this.users.values();
  }

  clearSession() {
    this.users.forEach((user) => {
      if (user.userId) {
        redisClient.del(`userSession:${user.userId}`);
      }
    });
    this.users.clear();
  }
}

export default UserSession;
