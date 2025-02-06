import BattleEntity from './battleEntity.class.js';
import { createRnadNum } from '../utils/math/createRandNum.js';
import getPlayerSession from './session/playerSession.class.js';
import { config } from '../config/config.js';
import payloadData from '../utils/packet/payloadData.js';
import { leaveDungeonResponseHandler } from '../handlers/dungeon/response/LeaveDungeonResponse.handler.js';
import { playerBattleLogResponseHandler } from '../handlers/dungeon/response/playerBattleLogResponse.handler.js';

class BattleStatus {
  constructor(dungeon, players, monsters) {
    this.playerSession = getPlayerSession();
    this.dungeon = dungeon;
    this.entity = [];
    players.forEach((player) => {
      this.entity.push(
        new BattleEntity(player.id, 0, false, player.getPlayerStat()),
      );
    });
    monsters.forEach((monster) => {
      this.entity.push(
        new BattleEntity(monster.idx, 1, true, monster.getMonsterStat()),
      );
    });
    this.turnIndex = -1;
  }

  getPlayerIndex(playerId) {
    this.entity.findIndex((player) => {
      return player.Ai === false && player.id == playerId;
    });
  }
  getMonsterIndex(monsterId) {
    this.entity.findIndex((monster) => {
      return monster.Ai === true && monster.id == monsterId;
    });
  }

  async BattleLoop() {
    if (this.turnIndex < 0 || ++this.turnIndex > this.entity.length) {
      this.turnIndex = 0;
      this.entity.sort((a, b) => {
        return a.getSpeed() - b.getSpeed();
      });
    }
    const controlEntity = this.entity[this.turnIndex];

    if (controlEntity.getHp() > 0 && controlEntity.getTurn() > 0) {
      const foe = [];
      for (let i = 0; i < this.entity.length; i++) {
        if (
          this.entity[i].getHp() > 0 &&
          this.entity[i].side != controlEntity.side
        ) {
          foe.push(i);
        }
      }

      if (foe.length === 0) {
        //전투 종료(적 없음)
        leaveDungeonResponseHandler(this.dungeon);
        return;
      }

      if (controlEntity.Ai) {
        //몬스터 컨트롤 S_MonsterAction S_SetMonsterHp S_SetPlayerHp
        const target = createRnadNum(0, foe.length);
        attackEntity(this.turnIndex, foe[target]);
        //target 공격
      } else {
        //최상위 선택지 목록 보내기
        const btns = [];
        btns.push(payloadData.BtnInfo('공격', true));

        playerBattleLogResponseHandler(
          playerSession.getPlayerIndex(controlEntity.id),
          config.battletag.Menu,
          '',
          false,
          btns,
        );

        //플레이어 컨트롤 S_BattleLog
      }
    }
  }
  attackEntity(attackerId, defenderId) {
    const attacker = this.entity[attackerId];
    const defender = this.entity[defenderId];
    defender.subHp(attacker.getAtk() - defender.getDef());
    this.entity[attackerId].subTurn(1);
  }
}

export default BattleStatus;
