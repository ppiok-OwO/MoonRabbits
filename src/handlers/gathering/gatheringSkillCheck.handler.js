import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';
import { addItemToInventory } from '../player/inventory/inventoryManager.js';

export const gatheringSkillCheckHandler = async (socket, packetData) => {
  const { deltatime } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const placedId = player.getGatheringIdx();
  if (placedId >= 0 && placedId < sector.resources.length) {
    if (
      player.CheckValidateTiming(sector.resources[placedId].getDifficulty())
    ) {
      const durability = sector.resources[placedId].getDurability();
      if (durability < 0) {
        const packet = PACKET.S2CChat(0, '이미 소모된 자원입니다.', 'System');
        return socket.write(packet);
      }
      player.gatheringSuccess = true;
      socket.write(PACKET.S2CGatheringSkillCheck(placedId, durability));
      gatheringDoneHandler(socket);
    } else {
      const packet = PACKET.S2CChat(0, '스킬체크 실패.', 'System');
      return socket.write(packet);
    }
  } else {
    handleError(
      socket,
      new CustomError(ErrorCodes.INVALID_INPUT, '잘못된 자원 데이터'),
    );
  }
};

// message C2SGatheringSkillCheck{
//     int32 placedId;
//     int32 deltatime;
//   }
//   message S2CGatheringSkillCheck{
//     int32 placedId;
//     int32 durabillity;
//   }
