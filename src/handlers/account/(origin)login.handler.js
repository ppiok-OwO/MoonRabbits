import Packet from '../../utils/packet/packet.js';
import payloadData from '../../utils/packet/payloadData.js';

/* (임시) 로그인 패킷 테스트 */
const loginHandler = (socket, packetData) => {
  // [case 01] 로그인 성공 - 캐릭터 보유
  const isSuccess = true;
  const msg = '로그인에 성공했습니다. 캐릭터 O';
  const ownedCharacters = [payloadData.OwnedCharacters('test', 1001)];

  // [case 02] 로그인 성공 - 캐릭터 미비
  // const isSuccess = true;
  // const msg = '로그인에 성공했습니다. 캐릭터 X';
  // const ownedCharacters = [];

  // [case 03] 로그인 실패
  // const isSuccess = false;
  // const msg = '로그인에 실패했습니다.';
  // const ownedCharacters = [];

  const packet = Packet.S_Login(isSuccess, msg, ownedCharacters);
  socket.write(packet);
};

export default loginHandler;
