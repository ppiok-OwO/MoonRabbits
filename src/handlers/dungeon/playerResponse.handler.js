import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import payloadData from '../../utils/packet/payloadData.js';

export const playerResponseHandler = (socket, packetData) => {
  const { responseCode } = packetData;
  const playerSession = getPlayerSession();
  const dungeonSessions = getDungeonSessions();
  const player = playerSession.getPlayer(socket);
  const dungeon = dungeonSessions.getDungeon(player.dungeonId);
  try {
    //이전 메시지에 따라서 확인
    switch (player.lastBattleLog) {
      //최상위 메뉴
      case config.battletag.Menu:
        sendBattleLogMenu(dungeon, responseCode);
      //몬스터 공격
      case config.battletag.Attack:
        attackMonster(dungeon, responseCode);
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
  } catch (error) {
    console.error(error);
  }
};

const sendBattleLogMenu = async (dungeon, player, responseCode) => {
  switch (responseCode) {
    case config.battletag.Attack:
      const btns = [];
      dungeon.monsters.forEach((monster) => {
        btns.push(payloadData.BtnInfo(`${monster.name}을 공격`, true));
      });
      playerBattleLogResponseHandler(
        playerSession.getPlayerIndex(controlEntity.id),
        config.battletag.Attack,
        '',
        false,
        btns,
      );
      break;
    default:
  }
};

const attackMonster = async (dungeon, player, responseCode) => {
  dungeon.battleStatus.attackEntity(
    dungeon.battlestatus.getPlayerIndex(player.id),
    dungeon.battlestatus.getMonsterIndex(dungeon.monsters[responseCode].idx),
  );
  dungeon.battleStatus.battleLoop();
};
