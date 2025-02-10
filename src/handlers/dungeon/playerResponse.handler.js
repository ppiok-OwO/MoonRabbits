import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import payloadData from '../../utils/packet/payloadData.js';

import { playerBattleLogResponseHandler } from './response/playerBattleLogResponse.handler.js';
import { screenDoneResponseHandler } from './response/ScreenDoneResponse.handler.js';

export const playerResponseHandler = (socket, packetData) => {
//전투 관련 패킷 변경으로 사용 불가.
  // const { responseCode } = packetData;
  // console.log('responseCode : ' + responseCode);
  // const playerSession = getPlayerSession();
  // const dungeonSessions = getDungeonSessions();
  // const player = playerSession.getPlayer(socket);
  // console.log('player.lastBattleLog : ' + player.lastBattleLog);
  // const dungeon = dungeonSessions.getDungeon(player.dungeonId);
  // try {
  //   if (responseCode == 0) {
  //     screenDoneResponseHandler(dungeon);
  //   }
  //   dungeon.battleStatus.battleLoop();
  //   //이전 메시지에 따라서 확인
  //   switch (player.lastBattleLog) {
  //     case 0:
  //       break;
  //     //최상위 메뉴
  //     case config.battletag.Menu:
  //       sendBattleLogMenu(dungeon, player, responseCode);
  //       break;
  //     //몬스터 공격
  //     case config.battletag.Attack:
  //       attackMonster(dungeon, player, responseCode);
  //       break;
  //     default:
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};

// const sendBattleLogMenu = async (dungeon, player, responseCode) => {
//   switch (responseCode) {
//     case 1:
//       const btns = [];
//       //적 찾기
//       const battleStatus = dungeon.battleStatus;
//       dungeon.monsters.forEach((monster) => {
//         btns.push(
//           payloadData.BtnInfo(
//             `${monster.name}을 공격`,
//             battleStatus.entity[battleStatus.getMonsterIndex(monster.idx)]
//               .getHp() > 0,
//           ),
//         );
//       });

//       playerBattleLogResponseHandler(
//         player,
//         config.battletag.Attack,
//         '',
//         true,
//         btns,
//       );
//       break;
//     default:
//   }
// };

// const attackMonster = (dungeon, player, responseCode) => {
//   console.log(
//     `dungeon.monsters[responseCode] ${dungeon.monsters[responseCode - 1]}`,
//   );
//   dungeon.battleStatus.attackEntity(
//     dungeon.battleStatus.getPlayerIndex(player.id),
//     dungeon.battleStatus.getMonsterIndex(
//       dungeon.monsters[responseCode - 1].idx,
//     ),
//   );

//   dungeon.battleStatus.battleLoop();
// };
