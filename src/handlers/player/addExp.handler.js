import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';

export const addExpHandler = (socket, packetData) => {
  const { count } = packetData; // 채집 개수

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const playerExp = player.getExp();
  const plusExp = count * 1; // 아이템 획득(count) 1당 경험치 1    // itemCode별 경험치 차별화?
  const targetExp = player.getTargetExp();

  if (playerExp + plusExp >= targetExp) {
    const { newLevel, newTargetExp, availablePoint } = player.levelUp();
    const updatedExp = player.setExp(playerExp + plusExp - targetExp);
    // 세션 내 모두에게 레벨업 알림
    playerSession.notify(
      Packet.S2CLevelUp(player.id, newLevel, newTargetExp, updatedExp, availablePoint),
    );
  } 
  // 경험치만 오른 경우
  else {
    const updatedExp = playerExp + plusExp;
    player.setExp(updatedExp);
    // 본인 경험치 UI 반영
    socket.write(Packet.S2CAddExp(updatedExp));
  }
};
