import { v4 as uuidV4 } from 'uuid';
import User from '../user.class.js';
import redisClient from '../../utils/redis/redis.config.js';

class UserSession {
  users = new Map();

  setUser(socket) {
    const newUser = new User(socket);

    this.users.set(socket, newUser);
    console.log('newUser : ', newUser);
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

    return user;
  }

  removeUser(socket) {
    this.users.delete(socket);
  }

  getUser(socket) {
    return this.users.get(socket);
  }

  getAllUsers() {
    return this.users.values();
  }

  clearSession() {
    this.users.clear();
  }
}

export default UserSession;
