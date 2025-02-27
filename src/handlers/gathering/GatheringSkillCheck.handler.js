import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';

export const gatheringSkillCheckHandler = (socket, packetData) => {
  const { deltatime } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const placedId = player.getGatheringIdx();
  if (placedId >= 0 && placedId < sector.resources.length) {
    if (
      sector.resources[placedId].CheckValidateTiming(
        player.gatheringAngle,
        player.gatheringStartTime,
        deltatime,
      )
    ) {
      const durability = sector.resources[placedId].subDurability();
      if(durability < 0){
        const packet = Packet.S2CChat(0, '이미 소모된 자원입니다.', 'System');
        return socket.write(packet);
      }

      socket.write(PACKET.S2CGatheringSkillCheck(placedId, durability));

      const dropItem = sector.resources[placedId].dropItem();
      socket.write(PACKET.S2CGatheringDone(placedId, dropItem.item, 1));

      // 나중에 아이템 받아오는 내역 필요함

      //

      // addExpHandler(socket, {
      //   count: sector.resources[placedId].getDifficulty(),
      // });

      if (durability <= 0) {
        setTimeout(
          () => sector.resetDurability(placedId ),
          sector.resources[placedId].getRespawnTime(),
        );
      }
    } else {
      handleError(
        new CustomError(ErrorCodes.INVALID_INPUT, '이미 채집된 자원'),
      );
    }
  } else {
    handleError(
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
