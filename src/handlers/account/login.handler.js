import UserSession from '../../classes/session/userSession.class.js';
import { findPlayerByUserId, findUserByEmail, updateLastLogin } from '../../db/user/user.db.js';
import { getPlayerSession, getUserSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import redisClient from '../../utils/redis/redis.config.js';

// 서버 재시작 후 한 번만 fullSession 초기화를 실행하기 위한 플래그
let isFullSessionCleared = false;

const clearFullSession = async () => {
  try {
    // Redis에서 fullSession 패턴의 모든 키 검색
    const keys = await redisClient.keys('fullSession:*');
    if (keys.length > 0) {
      // 모든 fullSession 키 삭제
      await Promise.all(keys.map((key) => redisClient.del(key)));
      console.log(`Cleared ${keys.length} fullSession keys from Redis.`);
    }
  } catch (error) {
    console.error('Error clearing fullSession keys:', error);
  }
};

/* 로그인 Handler */
const loginHandler = async (socket, packetData) => {
  try {
    // 서버 시작 후 첫 요청이면 fullSession 초기화 실행
    // if (!isFullSessionCleared) {
    //   await clearFullSession();
    //   isFullSessionCleared = true;
    // }

    const { email, pw } = packetData;

    // 로그인 ID로 사용자 검색
    const userData = await findUserByEmail(email);
    if (!userData) {
      const isSuccess = false;
      const msg = '이메일을 찾을 수 없습니다.';

      const failResponse = PACKET.S2CLogin(isSuccess, msg, []);
      return socket.write(failResponse);
    }
    // 비밀번호 일치 여부 확인
    const passwordMatch = await bcrypt.compare(pw, userData.password);
    if (!passwordMatch) {
      const isSuccess = false;
      const msg = '비밀번호가 일치하지 않습니다.';

      const failResponse = PACKET.S2CLogin(isSuccess, msg, []);
      return socket.write(failResponse);
    }

    // UserSession에 있는 id에 userData.userId를 저장
    const findPlayer = await findPlayerByUserId(userData.userId);
    socket.player = findPlayer;
    socket.user = userData;

    // 중복 로그인 방지
    // 4. Redis에 중복 로그인 체크
    const redisKey = `fullSession:${userData.userId}`;
    const sessionExists = await redisClient.exists(redisKey);
    if (sessionExists) {
      // 이미 존재하는 세션에서 플레이어 정보 가져오기
      const existingPlayerSessionStr = await redisClient.hget(redisKey, 'player');
      if (existingPlayerSessionStr) {
        const existingPlayerSession = JSON.parse(existingPlayerSessionStr);
        // 현재 로그인하려는 플레이어와 일치하는 경우 중복 로그인으로 간주
        if (existingPlayerSession.playerId === findPlayer.playerId) {
          const isSuccess = false;
          const msg = '중복 로그인 감지: 이미 로그인되어 있습니다.';

          await redisClient.del(redisKey);

          const playerSessionManager = getPlayerSession();
          const existingSocket = playerSessionManager.getSocketByNickname(
            existingPlayerSession.nickname,
          );

          const existingPlayer = playerSessionManager.getPlayer(existingSocket);
          const existingSocket_playerIdx = existingPlayer ? +existingPlayer.id : null;
          if (existingSocket) {
            const disconnectMsg = PACKET.S2CLogin(
              false,
              '다른 기기에서 로그인되어 기존 연결이 종료되었습니다.',
            );
            const deletePlayerCharacter = PACKET.S2CDespawn(existingSocket_playerIdx);
            existingSocket.write(disconnectMsg);
            existingSocket.write(deletePlayerCharacter);
            existingSocket.destroy();
          }

          const failResponse = PACKET.S2CLogin(isSuccess, msg);
          return socket.write(failResponse);
        }
      } else {
        // 사용자 세션은 존재하지만 player 정보가 없는 경우에도 중복 로그인으로 처리 가능
        const isSuccess = false;
        const msg = '중복 로그인 감지: 이미 로그인되어 있습니다.';

        const failResponse = PACKET.S2CLogin(isSuccess, msg);
        return socket.write(failResponse);
      }
    }

    // 로그인 성공 시, 사용자의 캐릭터 정보를 가져옴
    const isSuccess = true;
    const msg = '로그인에 성공했습니다.';
    await updateLastLogin(userData.userId);

    // login 이후에 userSession의 소켓 기반 임시 세션을 userId를 키로 사용한 Redis 해시로 업데이트
    const userSessionManager = getUserSessions();
    const user = userSessionManager.getUser(socket);
    if (user) {
      // userSession.class.js의 updateUserSessionAfterLogin 메서드를 호출하여
      // in-memory와 Redis에 로그인 정보를 업데이트
      await userSessionManager.updateUserSessionAfterLogin(socket, {
        userId: userData.userId,
        // 캐릭터가 없다면 빈 문자열이나 null, 캐릭터가 있으면 해당 정보를 저장
        nickname: findPlayer && findPlayer.nickname ? findPlayer.nickname : '',
        classCode:
          findPlayer && findPlayer.classCode ? findPlayer.classCode : '',
      });
      //console.log('----- 업데이트된 userSession ----- \n', user);
    }

    // 캐릭터가 존재한다면 playerSession 업데이트를 같이 진행
    if (findPlayer && findPlayer.nickname) {
      const ownedCharacters = [
        PAYLOAD_DATA.OwnedCharacter(findPlayer.nickname, findPlayer.classCode),
      ];
      const packet = PACKET.S2CLogin(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }

    // 캐릭터가 없는 경우에는 캐릭터 생성 창으로 이동하도록 처리
    const ownedCharacters = [];
    const packet = PACKET.S2CLogin(isSuccess, msg, ownedCharacters);
    return socket.write(packet);
  } catch (error) {
    console.error(
      `${chalk.redBright('[loginHandler Error]')}
      ${error}
      `,
    );
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'loginHandler 에러'),
    );
  }
};

export default loginHandler;
