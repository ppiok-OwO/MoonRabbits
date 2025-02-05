import { PACKET_ID } from '../../constants/header.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';

export const playerResponseHandler = (socket, packetData) => {
  const { responseCode } = packetData;
//던전 받기(이후에) 일단 개인에게만 전송

//선택지...
  switch(responseCode){
    case 1:

    break;
    case 2:

    break;
    case 3:

    break;
    case 4:

    break;
    case 5:

    break;
    default:

  }
  try {
    
  } catch (error) {
    console.error(error);
  }
};
