import { PACKET_ID } from '../../../constants/header.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';
import payloadData from '../../../utils/packet/payloadData.js';
import Monster from '../../../classes/monster.class.js';
import { screenDoneResponseHandler } from './ScreenDoneResponse.handler.js';


let monsterIdx = 0;

export const enterDungeonResponseHandler = (socket, dungeonCode) => {
  console.log('enterDungeonResponseHandler');
  //던전 받기(이후에) 일단 개인에게만 전송
  const playerSession = getPlayerSession();
  const dungeonSessions = getDungeonSessions();
  const newDungeon = dungeonSessions.setDungeon(dungeonCode);
  //플레이어
  const players = [];
  //몬스터
  const monsters = [];
  try {
    //파티시스템 만들면 여기에 로직 추가

    players.push(playerSession.getPlayer(socket));
    newDungeon.setPlayers(players);
    players.forEach((player) => {
      player.setDungeonId(newDungeon.id);
    });

    //몬스터 3마리 추가
    for (let i = 0; i < 3; i++) {
      monsters.push(new Monster(monsterIdx++, 2001, 'testIntern'));
    }
    console.log(`monsters.push(new Monster(monsterIdx++, 2001, 'testIntern')) ${monsters}`);
    newDungeon.setMonsters(monsters);
    console.log(`newDungeon.setMonsters(monsters) ${newDungeon.monsters}`);

    newDungeon.setBattleStatus();



    const payloadEnterDungeon = payload.S_EnterDungeon(
      newDungeon.getDungeonInfo(),
      players.map((player) => {
        return player.getPlayerStatus();
      }),
      payloadData.ScreenText('testScreenText', true),
      payloadData.BattleLog('testBattleLog', true,payloadData.BtnInfo('계속',true)),
    );
    newDungeon.notify(
      makePacket(PACKET_ID.S_EnterDungeon, payloadEnterDungeon),
    );


    

    newDungeon.battleStatus.BattleLoop();
  } catch (error) {
    console.error(error);
  }
};
