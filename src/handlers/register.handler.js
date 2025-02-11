import Packet from '../utils/packet/packet.js';

/* (임시) 회원가입 패킷 테스트 */
const registerHandler = (socket, packetData) => {
  // [case 01] 회원가입 성공
  const isSuccess = true;

  const msg = '회원가입에 성공했습니다.';
  // [case 02] 회원가입 실패
  // const isSuccess = false;
  // const msg = '회원가입에 실패했습니다.';

  const packet = Packet.S_Register(isSuccess, msg);
  socket.write(packet);
};

export default registerHandler;
