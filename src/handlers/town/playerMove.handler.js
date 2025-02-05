import { config } from '../../config/config.js';
import { getPlayerSession } from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

const playerMoveHandler = (socket, packetData) => {
  const { transform } = packetData;
  const { posX, posY, posZ, rot } = transform;
  const newTransform = payloadData.TransformInfo(posX, posY, posZ, rot);
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  console.log(player.playerId);

  const setMove = payload.S_Move(player.playerId, newTransform);

  const packet = makePacket(config.packetId.S_Move, newTransform);

  socket.write(packet);
  //playerSession.notify(packet);
};

export default playerMoveHandler;
