import Packet from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';

export const resourceListHandler = (socket, packetData) => {

  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const newSectorResources = sector.getResources();
  if (newSectorResources.length > 0) {
    try{
        player.sendPacket(Packet.S2CResourcesList(newSectorResources));
    }
    catch(err){
        console.error(err);
    }
  }
  console.log(newSectorResources);
  
};