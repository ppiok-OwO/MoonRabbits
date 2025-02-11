import Packet from '../utils/packet/packet.js';

const registerHandler = (socket, packetData) => {
  // (임시) 회원가입 패킷 테스트
  const isSuccess = true;
  const msg = '회원가입에 성공했습니다.';
  const packet = Packet.S_Register(isSuccess, msg);
  socket.write(packet);
};

export default registerHandler;
