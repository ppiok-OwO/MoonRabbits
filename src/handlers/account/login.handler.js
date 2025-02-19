import UserSession from '../../classes/session/userSession.class.js';
import { findPlayerByUserId, findUserByEmail } from '../../db/user/user.db.js';
import { getPlayerSession, getUserSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import payloadData from '../../utils/packet/payloadData.js';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

// !!! 패킷 정의 수정으로 S_Login -> S2CLogin 으로 일괄 수정해씀다

/* 로그인 Handler */
const loginHandler = async (socket, packetData) => {
  try {
    const { email, pw } = packetData;

    // 로그인 ID로 사용자 검색
    const userData = await findUserByEmail(email);
    if (!userData) {
      const isSuccess = false;
      const msg = '이메일을 찾을 수 없습니다.';

      const failResponse = Packet.S2CLogin(isSuccess, msg, []);
      return socket.write(failResponse);
    }
    // 비밀번호 일치 여부 확인
    const passwordMatch = await bcrypt.compare(pw, userData.password);

    if (!passwordMatch) {
      const isSuccess = false;
      const msg = '비밀번호가 일치하지 않습니다.';

      const failResponse = Packet.S2CLogin(isSuccess, msg, []);
      return socket.write(failResponse);
    }

    // 중복 로그인도 방지 (중복 로그인 처리는 추후 구현)

    // 로그인 성공 시 socket.user에 사용자 정보 저장
    socket.user = userData;
    console.log();

    // 로그인 성공 시, 사용자의 캐릭터 정보를 가져옴
    const isSuccess = true;
    const msg = '로그인에 성공했습니다.';

    // UserSession에 있는 id에 userData.userId를 저장해야함
    const findPlayer = await findPlayerByUserId(userData.userId);

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
        classCode: findPlayer && findPlayer.classCode ? findPlayer.classCode : '',
      });
      console.log('----- 업데이트된 userSession ----- \n', user);
    }

    // 캐릭터가 존재한다면 playerSession 업데이트를 같이 진행
    if (findPlayer && findPlayer.nickname) {
      // playerSession 생성 및 업데이트
      const playerSessionManager = getPlayerSession();
      // 반드시 await를 사용해서 Promise가 아닌 실제 Player 인스턴스를 받아야 함
      const newPlayer = await playerSessionManager.addPlayer(
        socket,
        userData,
        findPlayer.nickname,
        findPlayer.classCode,
      );
      // Redis에 저장할 때 사용할 키
      const redisKey = `playerSession:${newPlayer.id}`;
      await playerSessionManager.saveToRedis(redisKey, newPlayer);
      console.log('----- 업데이트된 playerSession & Redis 저장 완료 -----\n', newPlayer);

      const ownedCharacters = [
        payloadData.OwnedCharacters(newPlayer.nickname, newPlayer.classCode),
      ];
      const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }

    // 캐릭터가 없는 경우에는 캐릭터 생성 창으로 이동하도록 처리
    const ownedCharacters = [];
    const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
    return socket.write(packet);
  } catch (error) {
    console.error(
      `${chalk.redBright('[loginHandler Error]')}
      ${error}
      `,
    );
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'loginHandler 에러'));
  }
};

export default loginHandler;
