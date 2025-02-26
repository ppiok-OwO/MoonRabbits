import { updatePlayerExp, updatePlayerLevel } from '../../db/user/user.db.js';
import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';

export const addExpHandler = async (socket, packetData) => {
  const { count } = packetData; // 채집 개수

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const playerExp = player.getExp();
  const targetExp = player.getTargetExp();

  // 채집아이템 1당 경험치 결정    // itemCode별 경험치 차별화?
  const plusExp = count * 1;

  // 경험치 오르고 레벨업한 경우
  if (playerExp + plusExp >= targetExp) {
    const { newLevel, newTargetExp, abilityPoint } = player.levelUp();
    const updatedExp = player.setExp(playerExp + plusExp - targetExp);

    // DB 반영
    await updatePlayerLevel(newLevel, updatedExp, abilityPoint, socket.player.playerId);

    // 세션 내 모든 클라이언트에게 반영
    playerSession.notify(
      Packet.S2CLevelUp(player.id, newLevel, newTargetExp, updatedExp, abilityPoint),
    );
  }
  // 경험치만 오른 경우
  else {
    const updatedExp = playerExp + plusExp;
    player.setExp(updatedExp);

    // DB 반영
    await updatePlayerExp(updatedExp, socket.player.playerId);

    // 클라이언트 반영
    socket.write(Packet.S2CAddExp(updatedExp));
  }
};
