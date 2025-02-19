import Packet from '../../utils/packet/packet.js';
import {
  getPlayerSession,
  getDungeonSessions,
} from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';

export const gatheringSkillCheckHandler = (socket, packetData) => {
  const { placedId, deltatime } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const dungeon = getDungeonSessions().getDungeon(player.getDungeonId());
  if (placedId >= 0 && placedId < dungeon.resources.length) {
    if (dungeon.resources[placedId].CheckValidateTiming(deltatime)) {
      const durability = dungeon.resources[placedId].subDurability();

      socket.write(Packet.S2CGatheringSkillCheck(placedId, durability));
      const dropItem = dungeon.resources[placedId].dropItem();
      socket.write(Packet.S2CGatheringDone(placedId, dropItem.item, 1));

      addExpHandler(socket, {
        count: dungeon.resources[placedId].getDifficulty(),
      });

      if (durability === 0) {
        setTimeout(
          dungeon.resetDurability(placedId),
          dungeon.resources[placedId].getRespawnTime(),
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
