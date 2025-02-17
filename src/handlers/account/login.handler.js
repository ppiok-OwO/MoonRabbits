import UserSession from '../../classes/session/userSession.class.js';
import { findPlayerByUserId, findUserByEmail } from '../../db/user/user.db.js';
import { getUserSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import payloadData from '../../utils/packet/payloadData.js';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

/* 로그인 Handler */
const loginHandler = async (socket, packetData) => {
  try {
    const { email, pw } = packetData;

    // 로그인 ID로 사용자 검색
    const userData = await findUserByEmail(email);
    if (!userData) {
      const isSuccess = false;
      const msg = '이메일을 찾을 수 없습니다.';

      const failResponse = Packet.S_Login(isSuccess, msg, []);
      return socket.write(failResponse);
    }
    // 비밀번호 일치 여부 확인
    const passwordMatch = await bcrypt.compare(pw, userData.password);

    if (!passwordMatch) {
      const isSuccess = false;
      const msg = '비밀번호가 일치하지 않습니다.';

      const failResponse = Packet.S_Login(isSuccess, msg, []);
      return socket.write(failResponse);
    }

    // 중복 로그인도 방지 (중복 로그인 처리는 추후 구현)

    // 로그인 성공 시 socket.user에 사용자 정보 저장
    socket.user = userData;

    // 로그인 성공 시, 사용자의 캐릭터 정보를 가져옴
    const isSuccess = true;
    const msg = '로그인에 성공했습니다.';

    // UserSession에 있는 id에 userData.userId를 저장해야함

    const findPlayer = await findPlayerByUserId(userData.userId);

    // 로그인 하고 나서 userSession에 id와 nickname, classCode를 업데이트
    const user = getUserSessions().getUser(socket);
    if (user) {
      user.setUserInfo(userData.userId, findPlayer.nickname, findPlayer.classCode);
    }
    console.log('----- findPlayer ----- \n', findPlayer);
    console.log('----- user ----- \n', user);
    // [case 01] 로그인 성공 - 캐릭터를 생성하지 않았을 경우
    if (findPlayer.nickname === null) {
      const ownedCharacters = [];
      const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }
    // [case 02] 로그인 성공 - 캐릭터를 이미 보유하고 있을 경우
    if (findPlayer.nickname !== null) {
      const ownedCharacters = [
        payloadData.OwnedCharacters(findPlayer.nickname, findPlayer.classCode),
      ];
      const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }
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
