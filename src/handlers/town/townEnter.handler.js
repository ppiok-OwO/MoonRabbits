import { config } from '../../config/config.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

const townEnterHandler = (socket, packetData) => {
  let response = {
    player: {
      playerId: 123,
      nickname: packetData.nickname,
      class: packetData.class,
      transform: { posX: 1, poxY: 1, posZ: 1, rot: 1 },
      statInfo: {
        level: 1,
        hp: 10,
        maxHp: 10,
        mp: 10,
        maxMp: 10,
        atk: 1,
        def: 1,
        magic: 1,
        speed: 1,
      },
    },
  };

  // 처단 대상
  console.log(packetData.nickname);
  console.log(packetData.class);

  const transform = payloadData.TransformInfo(1, 1, 1, 1);
  console.log(transform);
  const statInfo = payloadData.StatInfo(1, 10, 10, 10, 10, 10, 10, 10, 10);
  console.log(statInfo);
  const playerInfo = payloadData.PlayerInfo(
    123,
    packetData.nickname,
    packetData.class,
    transform,
    statInfo,
  );
  console.log(playerInfo);
  const data = payload.S_Enter(playerInfo);
  console.log(data);

  const temp = makePacket(config.packetId.S_Enter, data);
  console.log(temp);

  socket.write(makePacket(config.packetId.S_Enter, data));
  console.log('응답 후 로그');
};

export default townEnterHandler;
