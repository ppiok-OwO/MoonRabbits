import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';

export const addExpHandler = (socket, packetData) => {
  const { count } = packetData;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const playerExp = player.getExp();
  const plusExp = count * 1; // 아이템 획득(count) 1당 경험치 1    // itemCode별 경험치 차별화?
  const targetExp = player.getTargetExp();
  const updatedExp = playerExp + plusExp;
  const isLevelUp = updatedExp > targetExp;
  if (isLevelUp) {
    const { newLevel, newTargetExp, availablePoint } = player.levelUp();
    updatedExp -= targetExp;
    player.setExp(updatedExp);
    // 본인 경험치 UI 반영
    player.sendPacket(Packet.S2CAddExp(updatedExp));
    // 모두에게 레벨업 알림
    playerSession.notify(
      Packet.S2CLevelUp(player.id, newLevel, newTargetExp, availablePoint),
    );
  } else {
    player.setExp(updatedExp);
    player.sendPacket(Packet.S2CAddExp(updatedExp));
  }
};
