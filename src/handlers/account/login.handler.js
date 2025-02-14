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
  // 패킷 정의 수정으로 S_Login -> S2CLogin 으로 일괄 수정해씀다
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

    // 로그인 성공 시, 사용자의 캐릭터 정보를 가져옴
    const isSuccess = true;
    const msg = '로그인에 성공했습니다.';

    // UserSession에 있는 id에 userData.userId를 저장해야함
    // const userSessions = getUserSessions().getUser(socket);
    // console.log('userSessions : ', userSessions);

    const findPlayer = await findPlayerByUserId(userData.userId);
    console.log('findPlayer : ', findPlayer);
    // [case 01] 로그인 성공 - 캐릭터를 생성하지 않았을 경우
    if (findPlayer.nickname === null) {
      const ownedCharacters = [];
      const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }
    // [case 02] 로그인 성공 - 캐릭터를 이미 보유하고 있을 경우
    if (findPlayer.nickname !== null) {
      const ownedCharacters = [
        payloadData.OwnedCharacters(findPlayer.nickname, findPlayer.classCode),
      ];
      const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
      return socket.write(packet);
    }
    // await createPlayer(userData.id, 'test1', 1001);

    // const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
    // socket.write(packet);
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
