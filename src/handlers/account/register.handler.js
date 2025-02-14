import { createUser, findUserByEmail } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';

/* 회원가입 Handler */
const registerHandler = async (socket, packetData) => {
  const { email, pw, pwCheck } = packetData;

  try {
    // 이메일 유효성 검사
    const validateEmail = (email) => {
      const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,}$/; // 이메일 형식 검사
      return emailRegex.test(email);
    };

    // 이메일 형식이 올바르지 않을 경우 msg 전송
    // msg = UI에 띄울 메시지
    if (!validateEmail(email)) {
      const isSuccess = false;
      const msg = '이메일 형식이 올바르지 않습니다.';

      const failResponse = Packet.S2CRegister(isSuccess, msg);
      return socket.write(failResponse);
    }

    // 두 가지 password Input 값을 받기 때문에
    // 서버에서 password와 pwCheck을 비교
    console.log(`check pw, pwcheck : ${(pw, pwCheck)}`);

    const verifyPassword = (pw, pwCheck) => {
      if (pw === pwCheck) {
        return true;
      }
    };

    // Client가 보내준 password와 pwCheck가 일치하지 않을 경우 msg 전송
    // msg = UI에 띄울 메시지
    if (!verifyPassword(pw, pwCheck)) {
      const isSuccess = false;
      const msg = '비밀번호가 일치하지 않습니다.';

      const failResponse = Packet.S2CRegister(isSuccess, msg);
      return socket.write(failResponse);
    }

    // 중복 이메일 확인
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      const isSuccess = false;
      const msg = '이미 존재하는 이메일입니다.';

      const failResponse = Packet.S2CRegister(isSuccess, msg);
      return socket.write(failResponse);
    }

    // 사용자 추가
    await createUser(email, pw);

    // 모든 조건문을 뚫고 왔을 때
    // 회원가입 성공!
    const isSuccess = true;
    const msg = '회원가입에 성공했습니다.';

    const successResponse = Packet.S2CRegister(isSuccess, msg);
    socket.write(successResponse);
  } catch (error) {
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'registerHandler 에러'));
  }
};

export default registerHandler;
