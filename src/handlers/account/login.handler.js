import { createPlayer, findUserByEmail } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import payloadData from '../../utils/packet/payloadData.js';
import bcrypt from 'bcrypt';

/* 로그인 Handler */
const loginHandler = async (socket, packetData) => {
  const packet = Packet.S_Login(true,"로그인 성공",[]); // 지우기
  socket.write(packet); // 지우기
  // try {
    // const { email, pw } = packetData;

    // // 로그인 ID로 사용자 검색
    // const userData = await findUserByEmail(email);
    // if (!userData) {
    //   const isSuccess = false;
    //   const msg = '이메일을 찾을 수 없습니다.';

    //   const failResponse = Packet.S_Login(isSuccess, msg, []);
    //   return socket.write(failResponse);
    // }

    // // 비밀번호 일치 여부 확인
    // const passwordMatch = await bcrypt.compare(pw, userData.password);

    // if (!passwordMatch) {
    //   const isSuccess = false;
    //   const msg = '비밀번호가 일치하지 않습니다.';

    //   const failResponse = Packet.S_Login(isSuccess, msg, []);
    //   return socket.write(failResponse);
    // }

    // 중복 로그인도 방지 (중복 로그인 처리는 추후 구현)

    // 로그인 성공 시, 사용자의 캐릭터 정보를 가져옴

  //   const isSuccess = true;
  //   const msg = '로그인에 성공했습니다.';
  //   // [case 01] 로그인 성공 - 캐릭터를 생성하지 않았을 경우
  //   if (userData.character === null) {
  //     const ownedCharacters = [];

  //     const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
  //     return socket.write(packet);
  //   }
  //   // [case 02] 로그인 성공 - 캐릭터를 이미 보유하고 있을 경우
  //   if (userData.character !== null) {
  //     const ownedCharacters = [
  //       payloadData.OwnedCharacters(userData.character.nickname, userData.character.class),
  //     ];
  //     const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
  //     return socket.write(packet);
  //   }
  //   // await createPlayer(userData.id, 'test1', 1001);

  //   // const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
  //   // socket.write(packet);
  // } catch (error) {
  //   console.error(error);
  //   socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'loginHandler 에러'));
  // }
};

export default loginHandler;
