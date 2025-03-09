import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const OPEN_TIMER = 10;

const openChestHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);

  const sector = getSectorSessions().getSector(player.getSectorId());

  if (!sector.hasChest) {
    socket.write(
      PACKET.S2CChat(0, '보물상자가 비활성화 상태입니다.', 'System'),
    );
    return;
  }

  sector.notify(PACKET.S2COpenChest(player.id, OPEN_TIMER));
};

export default openChestHandler;
